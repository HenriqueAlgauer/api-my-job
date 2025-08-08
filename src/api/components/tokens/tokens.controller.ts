import { Controller, Delete, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TokensService } from './tokens.service';

@ApiTags('tokens')
@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Delete('expired')
  removeExpired() {
    return this.tokensService.removeExpired();
  }
}
