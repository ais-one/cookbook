// Setting up webhook: https://api.telegram.org/bot{my_bot_token}/setWebhook?url={url_to_send_updates_to}
// Querying webhook: https://api.telegram.org/bot{my_bot_token}/getWebhookInfo

const { TELEGRAM_API_KEY, TELEGRAM_CHANNEL_ID } = process.env;

/**
 * Send a text message to a Telegram chat via the Bot API.
 * Falls back to TELEGRAM_CHANNEL_ID when no chatId is provided.
 *
 * @param text - Message text to send.
 * @param chatId - Target chat/channel ID. Defaults to TELEGRAM_CHANNEL_ID env var.
 */
export const sendMsg = async (text: string, chatId: string | number = ''): Promise<Response | { err: string }> => {
  try {
    const target = chatId || TELEGRAM_CHANNEL_ID;
    return await fetch(
      `https://api.telegram.org/bot${TELEGRAM_API_KEY}/sendMessage?chat_id=${target}&text=${encodeURIComponent(text)}`,
    );
  } catch (e) {
    return { err: String(e) };
  }
};

/** @deprecated Use `sendMsg(text)` directly. */
export const sendChannelMsg = async (text: string): Promise<Response | { err: string }> => sendMsg(text);
