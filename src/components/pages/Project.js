import { useEffect } from "react";
import styles from "./Project.module.css";

const Project = (props) => {
   useEffect(() => {}, []);

   return (
      <div className={styles.Project}>
         <div className={styles.flexgrid2}>
            <div className={styles.col}>
               <div>{props.image && <img src={props.image} />}</div>
            </div>
            <div className={styles.col}>
               <div>{props.image && <img src={props.image} />}</div>
            </div>
         </div>
      </div>
   );
};

export default Project;
