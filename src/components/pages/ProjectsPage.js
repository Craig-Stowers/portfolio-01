import Project from "./Project";
import styles from "./ProjectsPage.module.css";

// import image1 from "../../images/image1.png";
// import image2 from "../../images/image2.png";

const projectData = [
   { title: "test title 1", blurb: "here is a blurb" },
   { title: "test title 2", blurb: "here is a blurb" },
   { title: "test title 3", blurb: "here is a blurb" },
   { title: "test title 4", blurb: "here is a blurb" },
   { title: "test title 5", blurb: "here is a blurb" },
   { title: "test title 6", blurb: "here is a blurb" },
];

const ProjectsPage = (props) => {
   return (
      <div className={styles.ProjectsPage}>
         {/* <Project data={"here is some data"} image={image1} />
         <Project data={"here is some data"} image={image2} /> */}
      </div>
   );
};

export default ProjectsPage;
