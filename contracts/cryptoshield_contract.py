"""
CryptoShield Smart Contract (PyTeal)
=====================================
Stores scam reports on Algorand testnet.

Global State:
  REPORT_COUNT  (uint)  — total reports submitted
  ADMIN         (bytes) — admin wallet address (set on create)

Local State (per opted-in user):
  REPORT_HASH   (bytes) — IPFS CID of scam evidence
  IS_VERIFIED   (uint)  — 0=pending, 1=verified
  TIME          (uint)  — UNIX timestamp of last submission

Operations (via application_args[0]):
  "submit"  — submit a scam report CID (args: [0]="submit", [1]=CID)
  "verify"  — admin-only: verify a report (args: [0]="verify", [1]=target wallet)
  "get"     — read-only pass-through (always approves)
"""

from pyteal import *  # noqa: F401, F403


def approval_program():
    # ── Global Keys ──────────────────────────────────────────────────────────
    REPORT_COUNT = Bytes("REPORT_COUNT")
    ADMIN        = Bytes("ADMIN")

    # ── Local Keys ───────────────────────────────────────────────────────────
    REPORT_HASH  = Bytes("REPORT_HASH")
    IS_VERIFIED  = Bytes("IS_VERIFIED")
    TIME         = Bytes("TIME")

    # ── Helpers ──────────────────────────────────────────────────────────────
    is_admin     = Txn.sender() == App.globalGet(ADMIN)
    op            = Txn.application_args[0]

    # ── on_create ────────────────────────────────────────────────────────────
    # Called once when the contract is first deployed.
    # The deploying wallet becomes the permanent admin.
    on_create = Seq(
        App.globalPut(REPORT_COUNT, Int(0)),
        App.globalPut(ADMIN, Txn.sender()),
        Approve(),
    )

    # ── on_opt_in ────────────────────────────────────────────────────────────
    # Any user must opt-in before submitting a report.
    on_opt_in = Seq(
        App.localPut(Txn.sender(), REPORT_HASH, Bytes("")),
        App.localPut(Txn.sender(), IS_VERIFIED, Int(0)),
        App.localPut(Txn.sender(), TIME, Int(0)),
        Approve(),
    )

    # ── submit_report ─────────────────────────────────────────────────────────
    # args: [0]="submit", [1]=IPFS CID string (must be >10 chars)
    submit_report = Seq(
        # Validate: must have exactly 2 args
        Assert(Txn.application_args.length() == Int(2)),
        # Validate: CID must be longer than 10 chars (prevent empty/garbage)
        Assert(Len(Txn.application_args[1]) > Int(10)),
        # Store the IPFS CID
        App.localPut(Txn.sender(), REPORT_HASH, Txn.application_args[1]),
        # Reset verification status to pending
        App.localPut(Txn.sender(), IS_VERIFIED, Int(0)),
        # Record timestamp
        App.localPut(Txn.sender(), TIME, Global.latest_timestamp()),
        # Increment global counter
        App.globalPut(REPORT_COUNT, App.globalGet(REPORT_COUNT) + Int(1)),
        Approve(),
    )

    # ── verify_report ─────────────────────────────────────────────────────────
    # args: [0]="verify", [1]=base64-encoded target wallet address
    # ADMIN ONLY — only the deploying wallet can call this
    verify_report = Seq(
        # Must have exactly 2 args
        Assert(Txn.application_args.length() == Int(2)),
        # Enforce admin-only access
        Assert(is_admin),
        # Mark the target wallet's report as verified
        App.localPut(Txn.application_args[1], IS_VERIFIED, Int(1)),
        Approve(),
    )

    # ── get_report ────────────────────────────────────────────────────────────
    # Read-only — just approve, frontend reads state via algod
    get_report = Approve()

    # ── Main Router ───────────────────────────────────────────────────────────
    program = Cond(
        [Txn.application_id() == Int(0),              on_create],
        [Txn.on_completion() == OnComplete.OptIn,     on_opt_in],
        [Txn.on_completion() == OnComplete.DeleteApplication, Reject()],
        [Txn.on_completion() == OnComplete.UpdateApplication, Reject()],
        [op == Bytes("submit"),                       submit_report],
        [op == Bytes("verify"),                       verify_report],
        [op == Bytes("get"),                          get_report],
    )

    return program


def clear_program():
    """Clear state program — users can always clear their local state."""
    return Approve()


if __name__ == "__main__":
    import os
    os.makedirs("contracts", exist_ok=True)

    with open("contracts/approval.teal", "w") as f:
        compiled = compileTeal(  # noqa: F405
            approval_program(),
            mode=Mode.Application,  # noqa: F405
            version=8,
        )
        f.write(compiled)
    print("[OK] contracts/approval.teal written")

    with open("contracts/clear.teal", "w") as f:
        compiled = compileTeal(  # noqa: F405
            clear_program(),
            mode=Mode.Application,  # noqa: F405
            version=8,
        )
        f.write(compiled)
    print("[OK] contracts/clear.teal written")
