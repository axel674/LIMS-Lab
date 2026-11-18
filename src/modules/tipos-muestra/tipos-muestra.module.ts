import { Module } from '@nestjs/common';
import { TiposMuestraController } from './tipos-muestra.controller';
import { TiposMuestraService } from './tipos-muestra.service';

@Module({
  controllers: [TiposMuestraController],
  providers: [TiposMuestraService],
})
export class TiposMuestraModule {}
