import { Controller, Get, Param, Res, Query, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Controller('01')
export class ResolverController {
  @Get(':gtin/21/:serial')
  resolve(
    @Param('gtin') gtin: string,
    @Param('serial') serial: string,
    @Query('type') type: string,
    @Res() res: Response,
  ) {
    // 1. Log resolution attempt
    console.log(`Resolving GS1 Digital Link for GTIN: ${gtin}, Serial: ${serial}`);

    // 2. Handle JSON-LD request (machine-to-machine) (D-23)
    if (type === 'jsonld') {
      return res.status(HttpStatus.OK).json({
        '@context': 'https://gs1.github.io/v2.0/Product.jsonld',
        type: 'Product',
        gtin: gtin,
        serialNumber: serial,
        description: 'LoopPass Digital Twin',
        passportUrl: `https://app.looppass.io/passport/${gtin}/${serial}`,
      });
    }

    // 3. Default: Redirect to Consumer View (PWA)
    const destination = `https://app.looppass.io/p/01/${gtin}/21/${serial}`;
    return res.redirect(HttpStatus.MOVED_PERMANENTLY, destination);
  }
}
