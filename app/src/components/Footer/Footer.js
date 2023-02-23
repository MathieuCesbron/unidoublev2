import { useNavigate } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className="footer-wrapper">
      <a
        className="footer-link"
        href="https://github.com/MathieuCesbron"
        target="_blank"
      >
        Whitepaper
      </a>
      <a className="footer-link" onClick={() => navigate("/terms-of-use")}>
        Terms of use
      </a>
    </div>
  );
};

export default Footer;
