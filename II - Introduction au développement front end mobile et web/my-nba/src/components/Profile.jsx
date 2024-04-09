import styles from "@/styles/Profile.module.css";
import Image from "next/image";

export default function Profile({ user, isConnected }) {
  return (
    isConnected && (
      <>
        <p>Utilisateur : {user.username}</p>
        <Image
          width={100}
          height={100}
          className={styles.avatar}
          src={user.avatar}
          alt={"Avatar"}
        />
      </>
    )
  );
}
