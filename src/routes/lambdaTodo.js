import Todo from '../components/todo/Todo'

export default function lambdaTodo() {
    return (
      <div style={{ padding: "1px auto", background: 'rgb(220,220,220)', position:"relative"}}>
        <h2 style={{marginBottom:"0.5rem", marginLeft:"1rem"}}>Personal </h2>
        <Todo/>
      </div>
    );
  }