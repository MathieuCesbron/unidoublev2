import { useNavigate } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className="footer-wrapper">
      <a
        className="footer-link"
        href="https://shdw-drive.genesysgo.net/8XT1zezF9xe137Qns8dYHztJU93Lxhbz7nDraA2FAMRx/whitepaper.pdf"
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
