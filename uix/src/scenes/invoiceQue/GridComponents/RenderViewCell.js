import ViewPdf from "../viewPdf";

const RenderViewCell = ({params}) => {
    // Download logic here...
    return <ViewPdf id={params.row.id} />;
  };

  export default RenderViewCell