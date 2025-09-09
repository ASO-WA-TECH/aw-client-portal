//import { useNavigate } from "react-router-dom";
import HeroHeader from "../../stories/HeroHeader";
import FieldForm from "/src/Components/FieldForm";
import "./index.scss";

const LoginPage = () => {
  //const navigate = useNavigate()

  return (
    <>
      <HeroHeader pageType="login" />
      <section>
        <div>
          <FieldForm />
        </div>
      </section>
    </>
  );
};

export default LoginPage;
