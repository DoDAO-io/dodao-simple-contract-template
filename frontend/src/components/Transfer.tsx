import React, { FormEvent } from "react";

export function Transfer({ transferTokens, tokenSymbol }: any) {
  return (
    <div>
      <h4>Transfer</h4>
      <div className="block p-6 rounded-lg shadow-lg bg-white ">
        <form
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            // This function just calls the transferTokens callback with the
            // form's data.
            event.preventDefault();

            const formData = new FormData((event as any).target);
            const to = formData.get("to");
            const amount = formData.get("amount");

            if (to && amount) {
              transferTokens(to, amount);
            }
          }}
        >
          <div className="form-group mb-6">
            <input
              className="input-form-control"
              type="number"
              step="1"
              name="amount"
              placeholder={"Amount of " + tokenSymbol}
              required
            />
          </div>
          <div className="form-group mb-6">
            <input
              className="input-form-control"
              type="text"
              name="to"
              required
              placeholder={"Recipient address"}
            />
          </div>
          <div className="form-group">
            <input
              className="btn btn-primary primary-button"
              type="submit"
              value="Transfer"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
