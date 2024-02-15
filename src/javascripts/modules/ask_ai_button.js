import React, { useState } from "react";
import { Row, Col } from "@zendeskgarden/react-grid";
import { InkeepAI } from "@inkeep/ai-api";
import { Button } from "@zendeskgarden/react-buttons";
import { Inline } from "@zendeskgarden/react-loaders";

export const AskAIButton = ({ client }) => {
  const [isLoading, setLoading] = useState(false);

  const ikp = new InkeepAI({
    apiKey: "YOUR_API_KEY",
  });

  let messages = [];

  const sendMessage = (messages) => {
    // console.log("response", messages);
    setLoading(false);

    client.invoke("comment.appendText", messages.join(""));
  };

  const createChatSession = async ({ question }) => {
    const res = await ikp.chatSession.create({
      integrationId: "YOUR_INTEGRATION_ID",
      chatSession: {
        messages: [
          {
            role: "user",
            content: question,
          },
        ],
      },
      stream: true,
    });

    if (res.chatResultStream) {
      for await (const event of res.chatResultStream) {
        if (event.event == "message_chunk") {
          //   console.log(event);
          messages.push(event.data.contentChunk);
        }
      }
      sendMessage(messages);
    }
  };

  const handleClickAskAI = () => {
    try {
      setLoading(true);

      client.get("ticket").then(function ({ ticket }) {
        // console.log("create chat, question:", ticket.description);
        createChatSession({ question: ticket.description });
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <Row>
      <Col textAlign="center">
        <Button
          disabled={isLoading}
          isPrimary
          isStretched
          onClick={handleClickAskAI}
        >
          {isLoading ? <Inline /> : <>Ask AI</>}
        </Button>
      </Col>
    </Row>
  );
};
