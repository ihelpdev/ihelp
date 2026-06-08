import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { type, userId, amount } = await request.json();

    if (!type || !userId || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid payload. 'type', 'userId', and a positive 'amount' are required." },
        { status: 400 }
      );
    }

    switch (type) {
      /**
       * BOOKING_LOCK — Atomic: debit customer deposited balance, credit escrow.
       * In production: run as a Prisma $transaction([...]) to guarantee atomicity.
       */
      case "BOOKING_LOCK": {
        const mockUpdatedWallet = {
          userId,
          availableBalance: 500 - amount,   // mock deduction
          escrowBalance:    0   + amount,    // mock credit to escrow
          type: "DEPOSITED",
        };
        return NextResponse.json({
          success: true,
          message: `$${amount.toFixed(2)} locked in escrow for booking.`,
          wallet: mockUpdatedWallet,
        });
      }

      /**
       * ESCROW_RELEASE — Atomic: debit escrow, credit merchant earned balance.
       * In production: validate job status === "COMPLETED" before release.
       */
      case "ESCROW_RELEASE": {
        const mockMerchantWallet = {
          userId,
          availableBalance: 1240.5 + amount,  // mock credit to merchant
          escrowBalance:    150    - amount,   // mock deduction from escrow
          type: "EARNED",
        };
        return NextResponse.json({
          success: true,
          message: `$${amount.toFixed(2)} released from escrow to merchant.`,
          wallet: mockMerchantWallet,
        });
      }

      /**
       * DEPOSIT — Credit customer deposited wallet.
       */
      case "DEPOSIT": {
        const mockDepositResult = {
          userId,
          availableBalance: 500 + amount,
          escrowBalance:    0,
          type: "DEPOSITED",
        };
        return NextResponse.json({
          success: true,
          message: `$${amount.toFixed(2)} deposited successfully.`,
          wallet: mockDepositResult,
        });
      }

      default:
        return NextResponse.json(
          { success: false, message: `Unknown transaction type: '${type}'.` },
          { status: 400 }
        );
    }
  } catch {
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
