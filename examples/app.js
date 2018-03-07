import React from "react";
import { Subscribe, Container } from "unstated";

class AppContainer extends Container {
  state = {
    amount: 1
  };

  setAmount(amount) {
    this.setState({ amount });
  }
}

class CounterContainer extends Container {
  state = {
    count: 0,
    values: []
  };

  increment(amount) {
    const newValue = this.state.count + amount;
    this.setState({
      count: newValue,
      values: [{ value: newValue }].concat(this.state.values)
    });
  }

  decrement(amount) {
    this.setState({ count: this.state.count - amount });
  }
}

function Counter() {
  return (
    <Subscribe to={[AppContainer, CounterContainer]}>
      {(app, counter) => (
        <div>
          <span>Count: {counter.state.count}</span>
          <button onClick={() => counter.decrement(app.state.amount)}>-</button>
          <button onClick={() => counter.increment(app.state.amount)}>+</button>
        </div>
      )}
    </Subscribe>
  );
}

export default function App() {
  return (
    <Subscribe to={[AppContainer]}>
      {app => (
        <div>
          <Counter />
          <label>Amount: </label>
          <input
            type="number"
            value={app.state.amount}
            onChange={event => {
              app.setAmount(parseInt(event.currentTarget.value, 10));
            }}
          />
        </div>
      )}
    </Subscribe>
  );
}
