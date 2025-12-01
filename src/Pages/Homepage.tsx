import UserRequests from "../Components/UserRequests";
import LogoutLink from "../Components/LogoutLink";

const Homepage = () => {
  return (
    <>
      <div>Homepage</div>
      <div>
        <UserRequests />
        {/* Added here for testing purposes, will be moved into menu once available */}
        <LogoutLink />
      </div>
    </>
  );
};

export default Homepage;
