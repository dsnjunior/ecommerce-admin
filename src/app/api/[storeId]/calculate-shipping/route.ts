import { calcularPrecoPrazo, consultarCep } from "correios-brasil";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);

    const destination = searchParams.get("destination") ?? undefined;
    const weight = searchParams.get("weight") ?? undefined;
    const length = searchParams.get("length") ?? undefined;
    const height = searchParams.get("height") ?? undefined;
    const width = searchParams.get("width") ?? undefined;
    const codes = searchParams.get("codes") ?? undefined;
    const value = searchParams.get("value") ?? undefined;

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    if (!destination) {
      return new NextResponse("Destination is required", { status: 400 });
    }

    if (!weight) {
      return new NextResponse("Weight is required", { status: 400 });
    }

    if (!length) {
      return new NextResponse("Length is required", { status: 400 });
    }

    if (!width) {
      return new NextResponse("Width is required", { status: 400 });
    }

    if (!height) {
      return new NextResponse("Height is required", { status: 400 });
    }

    const store = await db.store.findUnique({
      where: {
        id: params.storeId,
      },
    });

    const originZipCode = store?.zipCode;

    if (!originZipCode) {
      return new NextResponse("Origin zip code is missing", { status: 403 });
    }

    const [[shipping], destinationInformation] = await Promise.all([
      calcularPrecoPrazo({
        sCepOrigem: originZipCode,
        sCepDestino: destination,
        nVlPeso: weight.toString(),
        nCdFormato: "1", //1 para caixa / pacote e 2 para rolo/prisma.
        nVlComprimento: length.toString(),
        nVlAltura: height.toString(),
        nVlLargura: width.toString(),
        nCdServico: codes ? codes.split(",") : ["41106"],
        nVlDiametro: "0",
        nVlValorDeclarado: value?.toString() ?? "0",
      }),
      consultarCep(destination),
    ]);

    if ("erro" in destinationInformation) {
      return new NextResponse("Destination zip code is invalid", {
        status: 400,
      });
    }

    return NextResponse.json({
      shipping: {
        deadline: `${shipping.PrazoEntrega} dias úteis`,
        price: Number(shipping.Valor.replace(",", "")),
      },
      destination: destinationInformation,
    });
  } catch (e) {
    const error = e as Error;
    return new NextResponse(error.message, { status: 500 });
  }
}
