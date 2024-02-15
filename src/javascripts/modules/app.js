import React from "react";
import { render } from "react-dom";
import { ThemeProvider, DEFAULT_THEME } from "@zendeskgarden/react-theming";
import { Grid, Row, Col } from "@zendeskgarden/react-grid";
import I18n from "../../javascripts/lib/i18n";
import { resizeContainer } from "../../javascripts/lib/helpers";
import { AskAIButton } from "./ask_ai_button";

const MAX_HEIGHT = 1000;

class App {
  constructor(client, _appData) {
    this._client = client;

    // this.initializePromise is only used in testing
    // indicate app initilization(including all async operations) is complete
    this.initializePromise = this.init();
  }

  /**
   * Initialize module, render main template
   */
  async init() {
    const { currentUser } = await this._client.get("currentUser");

    I18n.loadTranslations(currentUser.locale);

    const appContainer = document.querySelector(".main");

    render(
      <ThemeProvider theme={{ ...DEFAULT_THEME }}>
        <Grid>
          <Row>
            <Col data-test-id="sample-app-description">
              Ask Inkeep AI application
            </Col>
          </Row>
          <div id="button">
            <AskAIButton client={this._client} />
          </div>
        </Grid>
      </ThemeProvider>,
      appContainer
    );
    return resizeContainer(this._client, MAX_HEIGHT);
  }

  /**
   * Handle error
   * @param {Object} error error object
   */
  _handleError(error) {
    console.log("An error is handled here: ", error.message);
  }
}

export default App;
