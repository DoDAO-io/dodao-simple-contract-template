import { Token } from "@contracts/typechain-types";
import { TransferEvent } from "@contracts/typechain-types/@openzeppelin/contracts/token/ERC20/ERC20";
import { JsonRpcProvider } from "@ethersproject/providers";
import React, { useEffect, useState } from "react";
interface EventListPops {
  provider: JsonRpcProvider;
  tokenContract: Token;
}
export function EventList({ provider, tokenContract }: EventListPops) {
  const [events, setEvents] = useState<Array<TransferEvent>>([]);

  async function fetchEvents() {
    const filter = tokenContract.filters.Transfer();
    const events = await tokenContract.queryFilter(filter);

    console.log("fetchedEvents", events);
    setEvents(events);
  }
  useEffect(() => {
    fetchEvents();
  }, [provider, tokenContract]);
  return (
    <div className="mt-16">
      <h2>Events</h2>
      {events.length ? (
        <>
          {" "}
          <div className="event-list mt-4">
            <div className="flex justify-between mx-4">
              <div>From</div>
              <div>To</div>
              <div>Amount</div>
            </div>
          </div>
          <div className="event-list ">
            {events.map((event) => (
              <div className="event-list-item" key={event.data}>
                <div className="flex justify-between">
                  <div>{event.args[0]}</div>
                  <div>{event.args[1]}</div>
                  <div>{event.args[2].toString()}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="event-list-item"> No events found</div>
      )}
    </div>
  );
}
