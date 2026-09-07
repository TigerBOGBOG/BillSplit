
import { useState } from "react";
import "./App.css";

function App() {
  const [people, setPeople] = useState([]);
  const [human, setHuman] = useState({
    name: "",
    paid: ""
  });

  const [transactions, setTransactions] = useState([]);

  const handleDelete = (index) => {
    setPeople(people.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setPeople([...people, human]);

    setHuman({
      name: "",
      paid: ""
    });
  };

  const calculate = () => {
    if (people.length === 0) return;

    const total = people.reduce(
      (sum, person) => sum + Number(person.paid || 0),
      0
    );

    const average = total / people.length;

    const debtors = people
      .filter((person) => Number(person.paid) < average)
      .map((person) => ({
        name: person.name,
        amount: average - Number(person.paid)
      }));

    const creditors = people
      .filter((person) => Number(person.paid) > average)
      .map((person) => ({
        name: person.name,
        amount: Number(person.paid) - average
      }));

    const result = [];

    let debtorIndex = 0;
    let creditorIndex = 0;

    while (
      debtorIndex < debtors.length &&
      creditorIndex < creditors.length
    ) {
      const debtor = debtors[debtorIndex];
      const creditor = creditors[creditorIndex];

      const amount = Math.min(
        debtor.amount,
        creditor.amount
      );

      result.push({
        from: debtor.name,
        to: creditor.name,
        amount: Math.round(amount * 100) / 100
      });

      debtor.amount -= amount;
      creditor.amount -= amount;

      if (Math.abs(debtor.amount) < 0.01) {
        debtorIndex++;
      }

      if (Math.abs(creditor.amount) < 0.01) {
        creditorIndex++;
      }
    }

    setTransactions(result);
  };

  return (
    <main className="app">

      {/* Header */}
      <header className="header">
          <h1>Bill Split</h1>
          <p>คำนวณการหารค่าใช้จ่ายของฉันเเละผองเพื่อน</p>
      </header>


      {/* Add Person */}
      <section className="card">

        <div className="section-title">
          <div>
            <h2>เพิ่มคน</h2>
            <p>ใครจ่ายไปเท่าไหร่?</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form">

          <div className="input-group">
            <label>ชื่อ</label>

            <input
              value={human.name}
              type="text"
              placeholder="เช่น เสือ"
              onChange={(e) =>
                setHuman({
                  ...human,
                  name: e.target.value
                })
              }
              required
            />
          </div>


          <div className="input-group">
            <label>จ่ายไป</label>

            <div className="money-input">
              <input
                value={human.paid}
                type="number"
                min="0"
                placeholder="0"
                onChange={(e) =>
                  setHuman({
                    ...human,
                    paid: Math.max(
                      0,
                      Number(e.target.value) || 0
                    )
                  })
                }
              />

              <span>บาท</span>
            </div>
          </div>


          <button className="add-btn">
            <span>＋</span>
            เพิ่มคน
          </button>

        </form>

      </section>


      {/* People */}
      {people.length > 0 && (
        <section className="card people-card">

          <div className="people-header">
            <div>
              <h2>สมาชิก</h2>
              <div>

              </div>
              <p>{people.length} คน</p>
            </div>

            <span className="people-icon">👥</span>
          </div>


          <div className="people-list">

            {people.map((human, index) => (
              <div
                className="person"
                key={index}
              >
              <span className="people-icon"></span>
                

                <div className="person-info">
                  <strong>{human.name}</strong>
                  <span>
                    จ่ายไป {Number(human.paid || 0).toLocaleString()} บาท
                  </span>
                </div>

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => handleDelete(index)}
                >
                  ×
                </button>

              </div>
            ))}

          </div>

        </section>
      )}


      {/* Calculate */}
      <button
        className="calculate-btn"
        onClick={calculate}
        disabled={people.length === 0}
      >
        Calculate
      </button>


      {/* Transactions */}
      {transactions.length > 0 && (
        <section className="card result-card">

          <div className="result-title">
            <div className="success-icon">
              ✓
            </div>

            <div>
              <h2>ต้องโอน</h2>
              <p>โอนตามรายการด้านล่างได้เลย</p>
            </div>
          </div>


          <div className="transactions">

            {transactions.map((transaction, index) => (
              <div
                className="transaction"
                key={index}
              >

                <div className="transaction-person">
                  <span className="from">
                    {transaction.from}
                  </span>

                  <span className="arrow">
                    →
                  </span>

                  <span className="to">
                    {transaction.to}
                  </span>
                </div>

                <strong>
                  {transaction.amount.toLocaleString()} ฿
                </strong>

              </div>
            ))}

          </div>

        </section>
      )}

    </main>
  );
}

export default App;

