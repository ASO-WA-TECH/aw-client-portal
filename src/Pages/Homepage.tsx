import UserRequests from "../Components/UserRequests";
import LogoutButton from "../Components/LogoutButton";

const Homepage = () => {
  return (
    <>
      <div>Homepage</div>
      <div>
        <UserRequests />
        <LogoutButton />
      </div>
    </>
  );
};

export default Homepage;
