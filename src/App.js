import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import FilterableTable from './FilterableTable'
import './App.css';

class App extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      data: [
        { id: 1, order: "Beetle", species: "American Oil Beetle" },
        { id: 2, order: "Beetle", species: "Calligrapha Beetle" },
        { id: 3, order: "Caterpillar", species: "Banded Woolly Bear" },
        { id: 4, order: "Caterpillar", species: "Monarch" },
        { id: 5, order: "Caterpillar", species: "Winter Moth" },
        { id: 6, order: "Mantis", species: "Unicorn Mantis" },
        { id: 7, order: "Mantis", species: "Dead Leaf Mantis" },
        { id: 8, order: "Dragonfly", species: "Emperor" },
        { id: 9, order: "Dragonfly", species: "Blue Dasher" },
        { id: 10, order: "Caterpillar", species: "Banded Woolly Bear" }
      ],
      fields: {
        id:   { name: 'ID', sortable: true, sortableName: 'id'},
        order: { name: 'Order', sortable: true, sortableName: 'order', superTypeOf: 'species' },
        species: { name: 'Species', sortable: true, sortableName: 'species', subsetOf: 'order' }
      }

    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Insect Depot Repo</h2>
        </div>
        <Grid>
        <Row>
          <Col sm={10} smOffset={1}>
            <FilterableTable 
              data={this.state.data}
              fields={this.state.fields}
              initialSortedColumn="id"
            />
          </Col>
        </Row>
      </Grid>
      </div>
    );
  }
}

export default App;
