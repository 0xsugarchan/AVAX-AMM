import styles from "./Introduction.module.css";

export default function Introduction() {
  return (
    <div className={styles.introduction}>
      <div className={styles.content}>
        <h1 className={styles.title}>Welcome 🖐️</h1>
        <div className={styles.text}>
          <p>
            This is simple messenger dapp where you can send messages and AVAX
            directly on the Avalanche C-Chain. <br /><br />Every message and token transfer
            is stored on-chain through a custom smart contract, allowing you to
            communicate securely while transferring value. <br /><br />You can also choose
            to claim or refund the AVAX they receive, creating a smooth and
            transparent messaging experience.
          </p>
          <p className={styles.builtWith}>
            Built with <strong>{" "}
            <a
              href="https://www.unchain.tech/en"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              UNCHAIN ⚡️
            </a>
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}

