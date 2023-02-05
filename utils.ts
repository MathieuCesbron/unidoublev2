import { web3, Provider } from "@project-serum/anchor";

export async function generateUser(
  balance: number,
  provider: Provider
): Promise<web3.Keypair> {
  const user = web3.Keypair.generate();

  try {
    const tx = await provider.connection.requestAirdrop(
      user.publicKey,
      balance * web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(tx);
    return user;
  } catch (error) {
    console.log("error generating user: ", error);
  }
}
