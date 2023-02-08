use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("The country should be 30 chars or less")]
    InvalidCountry,

    #[msg("The diffie public key should be exactly 64 chars")]
    InvalidDiffiePubKey,

    #[msg("Remove items before deleting the seller account")]
    ShouldRemoveItemsBeforeDeletingSellerAccount,

    #[msg("The seller account is invalid")]
    InvalidSellerAccount,

    #[msg("A store can not have more than 1 000 000 seller accounts")]
    TooMuchSellerAccounts,

    #[msg("The seller account country should be the same as the store country")]
    InvalidSellerAccountCountry,

    #[msg("The store is invalid")]
    InvalidStore,

    #[msg("The category should be between 0 and 31")]
    InvalidCategory,

    #[msg("The price should be between 100 and 100 000 000 USDC cents")]
    InvalidPrice,

    #[msg("The amount should be between 1 and 50 000")]
    InvalidAmount,

    #[msg("The category is already full with 50 000 items")]
    InvalidCategoryFull,

    #[msg("The seller account is already full with 1000 items")]
    SellerAccountItemsFull,

    #[msg("The shadow hash should be exactly 44 chars")]
    InvalidShdwHash,

    #[msg("The seller is invalid")]
    InvalidSeller,

    #[msg("The associated token address is invalid")]
    InvalidAssociatedTokenAddress,

    #[msg("The token program is invalid")]
    InvalidTokenProgram,

    #[msg("The buyer index is invalid")]
    InvalidBuyerIndex,

    #[msg("The program token is invalid")]
    InvalidProgramToken,

    #[msg("The order must not be approved")]
    OrderMustNotBeApproved,

    #[msg("The order must be approved")]
    OrderMustBeApproved,

    #[msg("The index is invalid")]
    InvalidIndex,

    #[msg("The rating is invalid")]
    InvalidRating,

    #[msg("The order is invalid")]
    InvalidOrder,

    #[msg("The order is already rated")]
    OrderAlreadyRated,
}
