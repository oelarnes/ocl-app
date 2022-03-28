import React, {Component, Fragment} from "react";
import PropTypes from "prop-types";

import _ from "utils/utils";
import App from "../app";

import "vanilla-toast/vanilla-toast.css";

const chatClassMap = {
  cmustewart: "sower",
  magicflea: "dw",
  jrp: "sower",
  lasersloths: "sc",
  brodo: "sower",
};

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.messagesEnd = React.createRef();
  }

  scrollToBottom = () => {
    this.messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  };

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  onClickChat() {
    document.getElementById("chat-input").focus();
  }

  render() {
    // must be mounted to receive messages
    return (
      <div className={"chat-container"}>
        <div className='chat' onClick={this.onClickChat}>
          <div className='messages' >
            <Messages />
            <div style={{ float:"left", clear: "both" }} ref={this.messagesEnd} />
          </div>
          <Entry />
        </div>
      </div>
    );
  }
}

const Messages = () => {
  const groupBy = (xs, key) => (
    xs.reduce(function(rv, x) {
      const v = key(x);
      (rv[v] = rv[v] || []).push(x);
      return rv;
    }, {})
  );

  const groupedDates = groupBy(App.state.messages, ({time}) => new Date(time).toDateString());

  return Object.keys(groupedDates).length
    ? Object.entries(groupedDates)
      .map(([date, msgs], index) => (
        <Fragment key={date + index}>
          <MessagesHeader date={date} />
          {msgs.map((msg, index) =>
            <Message key={index} {...msg} />
          )}
        </Fragment>
      ))
    : <MessagesHeader date={new Date().toDateString()} />;
};

const Entry = () => {
  const onKeyDown = (e) => {
    if (e.key !== "Enter")
      return;

    let el = e.target;
    let text = el.value.trim();
    el.value = "";

    if (!text)
      return;

    App.send("say", text);
  };

  return <input id='chat-input' autoFocus className='chat-input' type='text' onKeyDown={onKeyDown} />;
};

const MessagesHeader = ({date}) => (
  <div style={{textAlign: "center"}}>{date}</div>
);

MessagesHeader.propTypes = {
  date: PropTypes.string.isRequired
};

const Message = ({time, name, text}) => {
  const chatClass = chatClassMap[name] || "sow";
  const date = new Date(time);
  const hours = _.pad(2, "0", date.getHours());
  const minutes = _.pad(2, "0", date.getMinutes());
  const timestamp = `${hours}:${minutes}`;

  return (
    <div>
      <time>{timestamp}</time>
      {" "}
      <span className={"name " + chatClass}>{name}</span>
      {" "}
      {text}
    </div>
  );
};

Message.propTypes = {
  time: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};
