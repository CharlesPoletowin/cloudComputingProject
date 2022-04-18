import { Link } from "react-router-dom";


export default function IndexPage() {
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>IndexPage Route</h2>
        <Link to="/amplify">amplify</Link> |{" "}
        <Link to="/lambda">lambda</Link>
        <Link to="/apartments">apartments</Link>
      </main>
    );
  }