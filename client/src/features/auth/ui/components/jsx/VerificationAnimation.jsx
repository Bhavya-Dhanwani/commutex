import Spinner from "./Spinner";
import SuccessTick from "./SuccessTick";
import ErrorIcon from "./ErrorIcon";
import styles from "../css/VerificationAnimation.module.css";

export default function VerificationAnimation({ state }) {
  return (
    <div className={styles.container}>
      {state === "error" ? (
        <ErrorIcon visible />
      ) : (
        <>
          <Spinner morphing={state === "morphing"} success={state === "success"} />
          <SuccessTick visible={state === "success"} />
        </>
      )}
    </div>
  );
}
