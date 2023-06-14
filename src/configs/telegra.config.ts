import { ConfigService } from '@nestjs/config';
import { ITelegramOptions } from '../telegram/telegram.interface';

export const getTelegramConfig = async (
  configService: ConfigService,
): Promise<ITelegramOptions> => {
  const token = configService.get('TELEGRAM_BOT_TOKEN');
  const chatId = configService.get('TELEGRAM_CHANEL_ID');

  if (!token) {
    throw new Error('TELEGRAM_TOKEN must be specified in env variables');
  }

  return {
    chatId,
    token,
  };
};
