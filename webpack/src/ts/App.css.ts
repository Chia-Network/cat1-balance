import styled from "styled-components";

const css: any = {};

css.Header = styled.div`
  padding: 16px 8px;
  background: #fff;
`;

css.Container = styled.div``;

css.Content = styled.div`
  padding: 1.5rem;
  .full-width-col {
    padding: 0 5px;
  }
`;

css.SearchContainer = styled.div`
  text-align: center;
`;

css.Search = styled.div`
  display: inline-block;
  text-align: left;
  p {
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 14px;
  }
`;

css.SearchInput = styled.div`
  input {
    background-color: #fff;
    border: 1px solid #abb0b2;
    border-radius: 4px;
    color: #777;
    font-size: 15px;
    padding: 0 4px;
    vertical-align: top;
    width: 650px;
    margin: 3px 8px 8px 0;
    line-height: 32px;
    height: 40px;
    :focus {
      border-color: #3aac59;
      outline: 0;
    }
  }
`;

css.SearchButton = styled.div`
  background-color: #3aac59;
  border: none;
  border-radius: 4px;
  color: #fff;
  display: inline-block;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.03em;
  line-height: 32px;
  margin: 8px;
  padding: 0 18px;
  transition: 0.23s ease-in-out;

  :hover {
    background-color: #777;
    color: #fff;
    cursor: pointer;
  }
`;

css.WalletResults = styled.div`
  background: #edfbee;
  padding: 1.5rem;
  text-align: center;
  margin-bottom: 15px;
`;

css.ShadowedBox = styled.div`
  display: inline-block;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  box-shadow: 0px 11px 14px -7px rgba(0, 0, 0, 0.2), 0px 23px 36px 3px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  text-align: center;
  margin: 25px 0;
  padding: 15px 50px;
`;

css.TableStyled = styled.table`
  width: 700px;
  font-family: "Roboto", sans-serif;
  th {
    font-size: 14px;
    font-weight: 500;
    border-bottom: 1px solid #e0e0e0;
    white-space: nowrap;
  }
  th:last-child {
    text-align: right;
  }
  td:last-child {
    text-align: right;
  }
  td {
    font-size: 14px;
    font-weight: 400;
    border-bottom: 1px solid #e0e0e0;
  }
  tbody tr:hover {
    cursor: pointer;
    background: #f5f5f5;
  }
`;

css.Gathering = styled.div`
  display: inline-block;
  width: 600px;
  padding: 75px 25px 50px;
  > div + div {
    margin: 15px;
  }
`;

css.WalletNumberContainer = styled.div`
  padding-top: 25px;
  text-align: center;
`;

css.WalletNumber = styled.div`
  font-size: 32px;
  font-weight: 500;
  width: 750px;
  display: inline-block;
  text-align: left;
`;

css.MoreResults = styled.div`
  .outline-green-button {
    padding: 0.25rem 1rem;
    cursor: pointer;
    margin-left: 15px;
  }
  > div + div {
    margin-top: 10px;
    margin-bottom: 10px;
  }
`;

css.ErrorMessage = styled.p`
  color: red;
`;

css.LearnMoreContainer = styled.div`
  cursor: pointer;
`;

css.DownloadSnapshotDb = styled.div`
  text-align: center;
  padding: 15px 0 50px;
`;

css.ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  border: 1px solid #abb0b2;
  border-radius: 3px;
  margin-top: 30px !important;
  margin-left: 0 !important;
  > div {
    background: #b0debd;
    height: 10px;
    border-radius: 2px;
  }
`;

css.LearnMoreLink = styled.div`
  cursor: pointer;
`;

css.LearnMoreArrow = styled.img`
  display: inline-block;
  vertical-align: top;
  margin-top: 8px;
  margin-left: 10px;
  transform: ${(props) => (props.learnMore ? "rotate(180deg)" : "rotate(0deg)")};
`;

css.LearnMore = styled.div`
  padding: 10px 20px;
  background: #f8f8f8;
  h2:first-child {
    margin-top: 10px;
  }
  h2 {
    font-size: 24px;
    font-weight: 500;
    margin: 10px 0;
    line-height: 24px;
    margin-top: 35px;
  }
  h3 {
    margin-top: 10px;
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 5px;
  }
  h4 {
    font-size: 14px;
    font-weight: 500;
  }
  img {
    margin: 10px 0;
  }
`;

css.Grey = styled.span`
  color: #9e9e9e;
  font-weight: 400;
`;

css.TextEyeIcon = styled.div`
  img {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
    top: -1px;
  }
`;

export default css;
