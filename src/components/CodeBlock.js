import SyntaxHighlighter from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const CodeBlock = ({ codeString }) => {
   const newStyle = { ...dark, 
      hljs:{...dark.hljs, opacity:0.14  }
   };

  // console.log(newStyle.hljs);

   return (
      <div style={{ textAlign: "left", position: "absolute", paddingLeft:300 }}>
         <SyntaxHighlighter language="javascript" style={newStyle}>
            {codeString}
         </SyntaxHighlighter>
      </div>
   );
};

export default CodeBlock;
