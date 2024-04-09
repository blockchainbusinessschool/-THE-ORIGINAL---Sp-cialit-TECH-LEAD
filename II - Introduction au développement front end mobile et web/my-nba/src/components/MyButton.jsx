import styles from "@/styles/MyButton.module.css";

export default function MyButton({ isConnected, handleClick }) {
  return (
    <div>
      <button
        className={isConnected ? styles.buttonLoggedIn : styles.buttonLoggedOut}
        onClick={handleClick}
      >
        {isConnected ? "Je suis connecté" : "Je suis déconnecté"}
      </button>
    </div>
  );
}
