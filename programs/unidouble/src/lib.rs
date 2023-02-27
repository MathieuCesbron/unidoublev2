use crate::error::ErrorCode;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::{invoke, invoke_signed};
use spl_associated_token_account::get_associated_token_address;
use spl_token::check_program_account;
use spl_token::instruction::transfer;

pub mod error;

declare_id!("DB3kCrqqtZrtCMHLmUauXsM6B9TTjSY2ajgGaoF4CnaL");

#[program]
pub mod unidouble {
    use std::str::FromStr;

    use super::*;

    pub fn init_store(ctx: Context<InitStore>, country: u16, bump: u8) -> Result<()> {
        let store = &mut ctx.accounts.store;
        store.creator = *ctx.accounts.user.key;
        store.bump = bump;
        store.country = country;

        Ok(())
    }

    pub fn init_seller_account(
        ctx: Context<InitSellerAccount>,
        diffie_public_key: String,
        shdw_hash: String,
    ) -> Result<()> {
        require!(
            diffie_public_key.chars().count() == 64,
            ErrorCode::InvalidDiffiePubKey
        );
        require!(shdw_hash.chars().count() == 44, ErrorCode::InvalidShdwHash);

        let store = &mut ctx.accounts.store;
        store.seller_count += 1;

        let seller_account = &mut ctx.accounts.seller_account;
        seller_account.number = store.seller_count;
        seller_account.seller_public_key = ctx.accounts.user.key();
        seller_account.diffie_public_key = diffie_public_key;
        seller_account.store_public_key = store.key();
        seller_account.shdw_hash = shdw_hash;

        Ok(())
    }

    pub fn init_buyer_account(ctx: Context<InitBuyerAccount>, shdw_hash: String) -> Result<()> {
        let buyer_account = &mut ctx.accounts.buyer_account;
        buyer_account.buyer_public_key = ctx.accounts.user.key();
        buyer_account.shdw_hash = shdw_hash;

        Ok(())
    }

    pub fn delete_seller_account(ctx: Context<DeleteSellerAccount>) -> Result<()> {
        let store = &mut ctx.accounts.store;
        store.seller_count -= 1;

        Ok(())
    }

    pub fn list_item(
        ctx: Context<ListItem>,
        unique_number: u32,
        category: u8,
        price: u32,
        amount: u16,
    ) -> Result<()> {
        require!(category < 32, ErrorCode::InvalidCategory);
        require!(price >= 100 && price <= 100000000, ErrorCode::InvalidPrice);
        require!(amount > 0 && amount <= 50000, ErrorCode::InvalidAmount);

        let store = &mut ctx.accounts.store;
        require!(
            store.info[category as usize] < 50000,
            ErrorCode::InvalidCategoryFull
        );
        store.info[category as usize] += 1;

        let seller_account = &mut ctx.accounts.seller_account;
        seller_account.item_count += 1;

        let item = &mut ctx.accounts.item;
        item.unique_number = unique_number;
        item.category = category;
        item.price = price;
        item.amount = amount;
        item.seller_public_key = ctx.accounts.user.key();
        item.seller_account_public_key = seller_account.key();
        item.shdw_hash_seller = seller_account.shdw_hash.clone();

        Ok(())
    }

    pub fn update_item(
        ctx: Context<UpdateItem>,
        category: u8,
        price: u32,
        amount: u16,
    ) -> Result<()> {
        require!(category < 32, ErrorCode::InvalidCategory);
        require!(price >= 100 && price <= 100000000, ErrorCode::InvalidPrice);
        require!(amount > 0 && amount <= 50000, ErrorCode::InvalidAmount);

        let store = &mut ctx.accounts.store;
        store.info[ctx.accounts.item.category as usize] -= 1;
        store.info[category as usize] += 1;

        let item = &mut ctx.accounts.item;
        item.category = category;
        item.price = price;
        item.amount = amount;

        Ok(())
    }

    pub fn buy_item(
        ctx: Context<BuyItem>,
        order_number: u32,
        amount: u16,
        shdw_hash_buyer: String,
    ) -> Result<()> {
        require!(amount > 0 && amount <= 50000, ErrorCode::InvalidAmount);
        require!(
            shdw_hash_buyer.chars().count() == 44,
            ErrorCode::InvalidShdwHash
        );

        require!(
            get_associated_token_address(
                ctx.accounts.user.key,
                &Pubkey::from_str("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v").unwrap()
            ) == ctx.accounts.user_usdc.key(),
            ErrorCode::InvalidAssociatedTokenAddress
        );

        require!(
            get_associated_token_address(
                &ctx.accounts.store.key(),
                &Pubkey::from_str("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v").unwrap()
            ) == ctx.accounts.store_usdc.key(),
            ErrorCode::InvalidProgramToken
        );

        let item = &mut ctx.accounts.item;

        let transfer_to_store = transfer(
            ctx.accounts.token_program.key,
            ctx.accounts.user_usdc.key,
            ctx.accounts.store_usdc.key,
            ctx.accounts.user.key,
            &[ctx.accounts.user.key],
            amount as u64 * item.price as u64 * u64::pow(10, 4),
        )?;

        invoke(
            &transfer_to_store,
            &[
                ctx.accounts.user_usdc.to_account_info(),
                ctx.accounts.store_usdc.to_account_info(),
                ctx.accounts.user.to_account_info(),
                ctx.accounts.token_program.to_account_info(),
            ],
        )?;

        let order = &mut ctx.accounts.order;

        order.order_number = order_number;
        order.item_number = item.unique_number;
        order.buyer_public_key = ctx.accounts.user.key();
        order.seller_public_key = ctx.accounts.seller.key();
        order.item_account_public_key = item.key();
        order.seller_account_public_key = ctx.accounts.seller_account.key();

        order.price_bought = item.price;
        order.amount_bought = amount;

        order.shdw_hash_buyer = shdw_hash_buyer;
        order.shdw_hash_seller = ctx.accounts.seller_account.shdw_hash.clone();

        Ok(())
    }

    // cancel_order returns 99% of the paid USDC to the buyer. There is a 1%
    // fee. The order should not be accepted by the seller to be canceled by
    // the buyer.
    pub fn cancel_order(ctx: Context<CancelOrder>) -> Result<()> {
        require!(
            get_associated_token_address(
                &ctx.accounts.store.creator.key(),
                &Pubkey::from_str("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v").unwrap()
            ) == ctx.accounts.creator_usdc.key(),
            ErrorCode::InvalidAssociatedTokenAddress
        );

        require!(
            get_associated_token_address(
                ctx.accounts.user.key,
                &Pubkey::from_str("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v").unwrap()
            ) == ctx.accounts.user_usdc.key(),
            ErrorCode::InvalidAssociatedTokenAddress
        );

        require!(
            get_associated_token_address(
                &ctx.accounts.store.key(),
                &Pubkey::from_str("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v").unwrap()
            ) == ctx.accounts.store_usdc.key(),
            ErrorCode::InvalidProgramToken
        );

        let order = &mut ctx.accounts.order;

        let amount_total = order.price_bought * order.amount_bought as u32;

        let amount_to_buyer = amount_total as f64 * 0.99;
        let amount_to_store_creator = amount_total as f64 * 0.01;

        let transfer_to_buyer = transfer(
            ctx.accounts.token_program.key,
            ctx.accounts.store_usdc.key,
            ctx.accounts.user_usdc.key,
            &ctx.accounts.store.key(),
            &[],
            amount_to_buyer as u64 * u64::pow(10, 4),
        )?;

        invoke_signed(
            &transfer_to_buyer,
            &[
                ctx.accounts.user_usdc.to_account_info(),
                ctx.accounts.store_usdc.to_account_info(),
                ctx.accounts.token_program.to_account_info(),
                ctx.accounts.store.to_account_info(),
            ],
            &[&[
                &ctx.accounts.store.creator.as_ref(),
                &ctx.accounts.store.country.to_le_bytes().as_ref(),
                &[ctx.accounts.store.bump],
            ]],
        )?;

        let transfer_to_store_creator = transfer(
            ctx.accounts.token_program.key,
            ctx.accounts.store_usdc.key,
            ctx.accounts.creator_usdc.key,
            &ctx.accounts.store.key(),
            &[],
            amount_to_store_creator as u64 * u64::pow(10, 4),
        )?;

        invoke_signed(
            &transfer_to_store_creator,
            &[
                ctx.accounts.creator_usdc.to_account_info(),
                ctx.accounts.token_program.to_account_info(),
                ctx.accounts.store_usdc.to_account_info(),
                ctx.accounts.store.to_account_info(),
            ],
            &[&[
                &ctx.accounts.store.creator.as_ref(),
                &ctx.accounts.store.country.to_le_bytes().as_ref(),
                &[ctx.accounts.store.bump],
            ]],
        )?;

        Ok(())
    }

    // approve_order to approve the order. The buyer can no longer cancel
    // the purchase.
    //
    // TODO: the order should be canceled and the money sent back the buyer
    // when too much time has passed and the seller still has not shipped the
    // order (after 1 week for example).
    pub fn approve_order(ctx: Context<AcceptOrder>) -> Result<()> {
        let order = &mut ctx.accounts.order;
        order.is_approved = true;

        Ok(())
    }

    // shipped_order send 94% of the money to the seller and 5% to the store,
    // the 1% left is for the buyer when he will review the item.
    pub fn shipped_order(ctx: Context<ShippedOrder>) -> Result<()> {
        require!(
            get_associated_token_address(
                &ctx.accounts.store.creator.key(),
                &Pubkey::from_str("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v").unwrap()
            ) == ctx.accounts.creator_usdc.key(),
            ErrorCode::InvalidAssociatedTokenAddress
        );

        require!(
            get_associated_token_address(
                ctx.accounts.user.key,
                &Pubkey::from_str("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v").unwrap()
            ) == ctx.accounts.seller_usdc.key(),
            ErrorCode::InvalidAssociatedTokenAddress
        );

        require!(
            get_associated_token_address(
                &ctx.accounts.store.key(),
                &Pubkey::from_str("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v").unwrap()
            ) == ctx.accounts.store_usdc.key(),
            ErrorCode::InvalidProgramToken
        );

        let order = &mut ctx.accounts.order;
        require!(order.is_approved, ErrorCode::OrderMustBeApproved);

        let amount_total = order.price_bought * order.amount_bought as u32;

        let amount_to_buyer = amount_total as f64 * 0.94;
        let amount_to_store_creator = amount_total as f64 * 0.05;

        let transfer_to_seller = transfer(
            ctx.accounts.token_program.key,
            ctx.accounts.store_usdc.key,
            ctx.accounts.seller_usdc.key,
            &ctx.accounts.store.key(),
            &[],
            amount_to_buyer as u64 * u64::pow(10, 4),
        )?;

        invoke_signed(
            &transfer_to_seller,
            &[
                ctx.accounts.seller_usdc.to_account_info(),
                ctx.accounts.store_usdc.to_account_info(),
                ctx.accounts.token_program.to_account_info(),
                ctx.accounts.store.to_account_info(),
            ],
            &[&[
                &ctx.accounts.store.creator.as_ref(),
                &ctx.accounts.store.country.to_le_bytes().as_ref(),
                &[ctx.accounts.store.bump],
            ]],
        )?;

        let transfer_to_store_creator = transfer(
            ctx.accounts.token_program.key,
            ctx.accounts.store_usdc.key,
            ctx.accounts.creator_usdc.key,
            &ctx.accounts.store.key(),
            &[],
            amount_to_store_creator as u64 * u64::pow(10, 4),
        )?;

        invoke_signed(
            &transfer_to_store_creator,
            &[
                ctx.accounts.creator_usdc.to_account_info(),
                ctx.accounts.token_program.to_account_info(),
                ctx.accounts.store_usdc.to_account_info(),
                ctx.accounts.store.to_account_info(),
            ],
            &[&[
                &ctx.accounts.store.creator.as_ref(),
                &ctx.accounts.store.country.to_le_bytes().as_ref(),
                &[ctx.accounts.store.bump],
            ]],
        )?;

        order.is_shipped = true;

        let item = &mut ctx.accounts.item;
        item.buyer_count += 1;

        let seller_account = &mut ctx.accounts.seller_account;
        seller_account.sales_volume += amount_total;
        seller_account.sales_count += 1;

        let store = &mut ctx.accounts.store;
        store.sales_count += 1;

        Ok(())
    }

    // The buyer gets 1% cashback when he reviews.
    pub fn review_item(ctx: Context<ReviewItem>, rating: u8) -> Result<()> {
        let order = &mut ctx.accounts.order;
        require!(!order.is_reviewed, ErrorCode::OrderAlreadyRated);
        require!(
            rating == 1 || rating == 2 || rating == 3 || rating == 4 || rating == 5,
            ErrorCode::InvalidRating
        );

        require!(
            get_associated_token_address(
                ctx.accounts.user.key,
                &Pubkey::from_str("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v").unwrap()
            ) == ctx.accounts.user_usdc.key(),
            ErrorCode::InvalidAssociatedTokenAddress
        );

        let amount_total = order.price_bought * order.amount_bought as u32;
        let amount_to_buyer = amount_total as f64 * 0.01;

        let transfer_to_buyer = transfer(
            ctx.accounts.token_program.key,
            ctx.accounts.store_usdc.key,
            ctx.accounts.user_usdc.key,
            &ctx.accounts.store.key(),
            &[],
            amount_to_buyer as u64 * u64::pow(10, 4),
        )?;

        invoke_signed(
            &transfer_to_buyer,
            &[
                ctx.accounts.user_usdc.to_account_info(),
                ctx.accounts.store_usdc.to_account_info(),
                ctx.accounts.token_program.to_account_info(),
                ctx.accounts.store.to_account_info(),
            ],
            &[&[
                &ctx.accounts.store.creator.as_ref(),
                &ctx.accounts.store.country.to_le_bytes().as_ref(),
                &[ctx.accounts.store.bump],
            ]],
        )?;

        order.is_reviewed = true;

        let item = &mut ctx.accounts.item;
        item.rating = (item.rating * item.rating_count as f32 + rating as f32)
            / (item.rating_count as f32 + 1.0);
        item.rating_count += 1;

        // Set the value of the catalog average rating
        let m: f32 = 3.5;
        // Set the value of the confidence number
        let c: f32 = 100.0;
        let bayesian_average =
            (item.rating_count as f32 * item.rating + m * c) / (item.rating_count as f32 + c);
        item.score = bayesian_average;

        Ok(())
    }

    pub fn delete_item(ctx: Context<DeleteItem>) -> Result<()> {
        let store = &mut ctx.accounts.store;
        store.info[ctx.accounts.item.category as usize] -= 1;

        let seller_account = &mut ctx.accounts.seller_account;
        seller_account.item_count -= 1;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(country: u16)]
pub struct InitStore<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        payer = user,
        space = 119,
        seeds = [user.key().as_ref(), country.to_le_bytes().as_ref()],
        bump,
    )]
    pub store: Account<'info, Store>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitSellerAccount<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut, constraint = store.seller_count < 1000000 @ ErrorCode::TooMuchSellerAccounts)]
    pub store: Account<'info, Store>,

    #[account(
        init,
        payer = user,
        space = 204,
        seeds = [user.key().as_ref()],
        bump,
    )]
    pub seller_account: Account<'info, SellerAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitBuyerAccount<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        payer = user,
        space = 88,
        seeds = [user.key().as_ref(), b"unidouble_buyer".as_ref()],
        bump,
    )]
    pub buyer_account: Account<'info, BuyerAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(unique_number:u32)]
pub struct ListItem<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut)]
    pub store: Account<'info, Store>,

    #[account(
        mut,
        constraint = seller_account.seller_public_key == user.key() @ ErrorCode::InvalidSellerAccount,
        constraint = seller_account.store_public_key == store.key() @ ErrorCode::InvalidSellerAccount,
        constraint = seller_account.item_count < 1000 @ ErrorCode::SellerAccountItemsFull,
    )]
    pub seller_account: Account<'info, SellerAccount>,

    #[account(
        init,
        payer = user,
        space = 1000,
        seeds = [user.key.as_ref(), unique_number.to_le_bytes().as_ref()],
        bump,
    )]
    pub item: Account<'info, Item>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateItem<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        constraint = seller_account.seller_public_key == user.key() @ ErrorCode::InvalidSellerAccount,
        constraint = seller_account.store_public_key == store.key() @ ErrorCode::InvalidSellerAccount,
        constraint = seller_account.key() == item.seller_account_public_key @ ErrorCode::InvalidSellerAccount,
    )]
    pub seller_account: Account<'info, SellerAccount>,

    #[account(mut)]
    pub item: Account<'info, Item>,

    #[account(mut)]
    pub store: Account<'info, Store>,
}

#[derive(Accounts)]
#[instruction(order_number:u32)]
pub struct BuyItem<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        constraint = seller_account.seller_public_key != user.key() @ ErrorCode::InvalidSellerAccount,
        constraint = seller_account.store_public_key == store.key() @ ErrorCode::InvalidSellerAccount,
        constraint = seller_account.key() == item.seller_account_public_key @ ErrorCode::InvalidSellerAccount,
    )]
    pub seller_account: Account<'info, SellerAccount>,

    #[account(
        mut,
        constraint = seller.key() == item.seller_public_key @ ErrorCode::InvalidSeller
    )]
    /// CHECK: safe
    pub seller: AccountInfo<'info>,

    #[account(mut)]
    pub item: Account<'info, Item>,

    #[account(
        mut,
        constraint = store_creator.key() == store.creator @ ErrorCode::InvalidStore,
    )]
    /// CHECK: safe
    pub store_creator: AccountInfo<'info>,

    #[account(mut)]
    pub store: Account<'info, Store>,

    /// CHECK: safe
    #[account(mut)]
    pub user_usdc: AccountInfo<'info>,

    /// CHECK: safe
    #[account(mut)]
    pub store_usdc: AccountInfo<'info>,

    /// CHECK: safe
    #[account(constraint = check_program_account(&token_program.key()).is_ok() @ ErrorCode::InvalidTokenProgram)]
    pub token_program: AccountInfo<'info>,

    #[account(
        init,
        payer = user,
        space = 800,
        seeds = [user.key().as_ref(), order_number.to_le_bytes().as_ref()],
        bump,
    )]
    pub order: Account<'info, Order>,

    /// CHECK: safe
    pub system_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct CancelOrder<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        constraint = seller_account.seller_public_key != user.key() @ ErrorCode::InvalidSellerAccount,
        constraint = seller_account.store_public_key == store.key() @ ErrorCode::InvalidSellerAccount,
        constraint = seller_account.key() == item.seller_account_public_key @ ErrorCode::InvalidSellerAccount,
    )]
    pub seller_account: Account<'info, SellerAccount>,

    #[account(mut)]
    pub item: Account<'info, Item>,

    #[account(mut)]
    pub store: Account<'info, Store>,

    /// CHECK: safe
    #[account(mut)]
    pub user_usdc: AccountInfo<'info>,

    /// CHECK: safe
    #[account(mut)]
    pub creator_usdc: AccountInfo<'info>,

    /// CHECK: safe
    #[account(mut)]
    pub store_usdc: AccountInfo<'info>,

    #[account(
        mut,
        close = user,
        constraint = order.buyer_public_key == user.key() @ ErrorCode::InvalidOrder,
        constraint = !order.is_approved @ ErrorCode::OrderMustNotBeApproved
    )]
    pub order: Account<'info, Order>,

    /// CHECK: safe
    #[account(constraint = check_program_account(&token_program.key()).is_ok() @ ErrorCode::InvalidTokenProgram)]
    pub token_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct AcceptOrder<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        constraint = item.seller_public_key == user.key() @ ErrorCode::InvalidSeller
    )]
    pub item: Account<'info, Item>,

    #[account(
        mut,
        constraint = order.item_account_public_key == item.key() @ ErrorCode::InvalidOrder
    )]
    pub order: Account<'info, Order>,
}

#[derive(Accounts)]
pub struct ShippedOrder<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        constraint = seller_account.seller_public_key == user.key() @ ErrorCode::InvalidSellerAccount,
        constraint = seller_account.store_public_key == store.key() @ ErrorCode::InvalidSellerAccount,
        constraint = seller_account.key() == item.seller_account_public_key @ ErrorCode::InvalidSellerAccount,
    )]
    pub seller_account: Account<'info, SellerAccount>,

    #[account(mut)]
    pub store: Account<'info, Store>,

    #[account(
        mut,
        constraint = item.seller_public_key == user.key() @ ErrorCode::InvalidSeller
    )]
    pub item: Account<'info, Item>,

    /// CHECK: safe
    #[account(mut)]
    pub seller_usdc: AccountInfo<'info>,

    /// CHECK: safe
    #[account(mut)]
    pub creator_usdc: AccountInfo<'info>,

    /// CHECK: safe
    #[account(mut)]
    pub store_usdc: AccountInfo<'info>,

    #[account(
        mut,
        constraint = order.item_account_public_key == item.key() @ ErrorCode::InvalidOrder
    )]
    pub order: Account<'info, Order>,

    /// CHECK: safe
    #[account(constraint = check_program_account(&token_program.key()).is_ok() @ ErrorCode::InvalidTokenProgram)]
    pub token_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct ReviewItem<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut)]
    pub item: Account<'info, Item>,

    #[account(
        mut,
        constraint = seller_account.store_public_key == store.key() @ ErrorCode::InvalidSellerAccount,
        constraint = seller_account.key() == item.seller_account_public_key @ ErrorCode::InvalidSellerAccount,
    )]
    pub seller_account: Account<'info, SellerAccount>,

    #[account(mut)]
    pub store: Account<'info, Store>,

    #[account(
        mut,
        constraint = order.item_account_public_key == item.key() @ ErrorCode::InvalidOrder,
        constraint = order.buyer_public_key == user.key() @ ErrorCode::InvalidOrder,
    )]
    pub order: Account<'info, Order>,

    /// CHECK: safe
    #[account(mut)]
    pub user_usdc: AccountInfo<'info>,

    /// CHECK: safe
    #[account(mut)]
    pub store_usdc: AccountInfo<'info>,

    /// CHECK: safe
    #[account(constraint = check_program_account(&token_program.key()).is_ok() @ ErrorCode::InvalidTokenProgram)]
    pub token_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct DeleteItem<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        constraint = seller_account.seller_public_key == user.key() @ ErrorCode::InvalidSellerAccount,
        constraint = seller_account.store_public_key == store.key() @ ErrorCode::InvalidSellerAccount,
        constraint = seller_account.key() == item.seller_account_public_key @ ErrorCode::InvalidSellerAccount,
    )]
    pub seller_account: Account<'info, SellerAccount>,
    #[account(mut, close = user)]
    pub item: Account<'info, Item>,
    #[account(mut)]
    pub store: Account<'info, Store>,
}

#[derive(Accounts)]
pub struct DeleteSellerAccount<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        close = user,
        constraint = seller_account.seller_public_key == user.key() @ ErrorCode::InvalidSellerAccount,
        constraint = seller_account.store_public_key == store.key() @ ErrorCode::InvalidStore,
        constraint = seller_account.item_count == 0 @ ErrorCode::ShouldRemoveItemsBeforeDeletingSellerAccount,
        )]
    pub seller_account: Account<'info, SellerAccount>,
    #[account(mut)]
    pub store: Account<'info, Store>,
}

#[account]
pub struct Store {
    // Every store has 32 categories.
    // Every category has a max of 65 535 items.
    pub info: [u16; 32], // +64
    pub creator: Pubkey, // +32
    pub country: u16,    // +2

    pub bump: u8, // +1

    // Use to give a number for every seller and sales.
    // We can then give NFTs for special seller and sales.
    // e.g. the buyer get a NFT every 1000 sales of the store.
    pub seller_count: u32, // +4
    pub sales_count: u64,  // +8
}

#[account]
pub struct SellerAccount {
    pub number: u32,  // +4
    pub country: u16, // +2

    pub seller_public_key: Pubkey, // +32
    pub store_public_key: Pubkey,  // +32

    // sales_volume in USDC cent.
    pub sales_volume: u32, // +4
    pub sales_count: u32,  // +4
    pub item_count: u16,   // +2

    pub diffie_public_key: String, // +64+4
    pub shdw_hash: String,         // +4+44=48
}

#[account]
pub struct BuyerAccount {
    pub buyer_public_key: Pubkey, // +32
    pub shdw_hash: String,        // +4+44=48
}

#[account]
pub struct Item {
    // unidque_number is a random number used to uniquely identify the item.
    pub unique_number: u32, // +4
    pub category: u8,       // +1
    // price in USDC cent, a price of 1 USDC will equal 100 on-chain.
    pub price: u32,  // +4
    pub amount: u16, // +2

    pub seller_public_key: Pubkey,         // +32
    pub seller_account_public_key: Pubkey, // +32

    pub buyer_count: u32,  // +4
    pub rating_count: u16, // +2
    pub rating: f32,       // +4
    pub score: f32,        // +4

    pub shdw_hash_seller: String, // +4+44=48
}

#[account]
pub struct Order {
    pub order_number: u32,                 // +4
    pub item_number: u32,                  // +4
    pub buyer_public_key: Pubkey,          // +32
    pub seller_public_key: Pubkey,         // +32
    pub seller_account_public_key: Pubkey, // +32
    pub item_account_public_key: Pubkey,   // +32

    pub price_bought: u32,
    pub amount_bought: u16,

    pub is_approved: bool,
    pub is_shipped: bool,
    pub is_reviewed: bool,

    pub shdw_hash_seller: String,
    pub shdw_hash_buyer: String,
}
