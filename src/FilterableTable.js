import React, { Component } from 'react';
import { Table, Row, Col, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import './FilterableTable.css'

class FilterableTable extends Component {

  constructor(props) {
    super(props)
    
    this.state = {
      sortOrder: 1,
      sortedField: this.props.initialSortedColumn,
      fieldAttributes: [],
      filteredData: this.props.data,
      filteredAttributes: null,
      currentFilter: null
    }
    
    this.handleFilterChange = this.handleFilterChange.bind(this)
  }

  componentDidMount() {
    this.setState({
      fieldAttributes: this.getUniqueAttributes()
    })
  }

  getUniqueAttributes() {
    return Object.keys(this.props.fields).map((fieldID) => {
      var field = this.props.fields[fieldID]
      return ({
        field: field.sortableName,
        fieldDisplayName: field.name,
        attributes: [...new Set(this.props.data.map((item) => item[field.sortableName]))]
      })
    })    
  }
  
  getUniqueAttributesFiltered(currentFilter, filteredData) {
    if (typeof currentFilter === "undefined") {
      currentFilter = this.state.currentFilter
    }

    if (typeof filteredData === "undefined") {
      filteredData = this.state.filteredData
    }

    return Object.keys(this.props.fields).map((fieldID) => {
      var field = this.props.fields[fieldID]
      var uniqueAttributes
      if (field.subsetOf != null && currentFilter ) {
        let superType = field.subsetOf
        if (superType === currentFilter.field.sortableName) {
          uniqueAttributes = [...new Set(filteredData.map((item) => {
            return item[field.sortableName]
          }))]
        } else {          
          uniqueAttributes = [...new Set(this.props.data.map((item) => item[field.sortableName]))]
        }
      } else {
          uniqueAttributes = [...new Set(this.props.data.map((item) => item[field.sortableName]))]
      } 
      return ({
        field: field.sortableName,
        fieldDisplayName: field.name,
        attributes: uniqueAttributes
      })      
    })    
  }

  handleSortClick(sortBy, sortOrder) {
    if (sortBy !== this.state.sortedField) {
      sortOrder = 1
    } else {
      sortOrder = this.state.sortOrder * -1
    }

    let sortedData = this.sortData(this.state.filteredData, sortBy, sortOrder)
    this.setState((prevState) => {
      return {
        filteredData: sortedData,
        sortedField: sortBy,
        sortOrder: sortOrder 
      }
    })
  }

  handleFilterChange(event) {
    this.filterData(event.target.name, event.target.value)
  }

  filterData(attributeName, attribute) {
    let filter = {attribute: attribute, field: this.props.fields[attributeName]}
    let filteredData = this.props.data.filter((item) => {
      if (attribute === "all") {
        return item
      } else if (item[attributeName].toString() === attribute) {
        return item
      }
      return null
    })
    
    let filteredAttributes = this.getUniqueAttributesFiltered(filter, filteredData)
    this.setState({
      filteredData: filteredData,
      currentFilter: filter,
      fieldAttributes: filteredAttributes
    })
  }

  sortData(data, property, sortOrder) {
    let dynamicSort = (property) => {
      return (a,b) => {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0
        return result * sortOrder
      }
    }
    return data.sort(dynamicSort(property))
  }

  renderFilters() {   
    return this.state.fieldAttributes.map((field) => {
      var selected = 'All'
      var options = field.attributes.map((attribute) => { 
        if (this.state.currentFilter) {
          if (this.state.currentFilter.attribute === attribute) {
            selected = attribute          
          }
        }
        return (
          <option key={attribute} value={attribute}>{attribute}</option>
        )
      })

      options.unshift(
        <option key='all' value='all'>All</option> 
      )

      return(
        <FormGroup key={field.field}>
          <ControlLabel>{field.fieldDisplayName}: </ControlLabel>
          {' '}
          <FormControl 
            componentClass="select"
            name={field.field}
            onChange={this.handleFilterChange}
            value={selected}
            >       
            {options}
          </FormControl>
        </FormGroup>
      )
    })
  }

  renderRows(data) {    
    return data.map((item) => {
      let cells = Object.keys(item).map((key, index) => {
        return(
          <td key={index}>{item[key]}</td>
        )
      })
      return (
        <tr key={item.id}>
          {cells}
        </tr>
      )
    })
  }

  renderHeader(fieldIDs) {    
    return fieldIDs.map((fieldID) => {
      var field = this.props.fields[fieldID]
      return (
        <th key={field.name} onClick={field.sortable ? () => this.handleSortClick(field.sortableName, this.state.sortOrder) : null}>
          {field.name}
          <span className={ this.state.sortedField === fieldID 
            ? this.state.sortOrder > 0 
              ? "fa fa-sort-asc" 
              : "fa fa-sort-desc"
            : "fa fa-sort"
          } aria-hidden="true"></span>
        </th>
      )
    })
  }

  render() {    
    return (
      <div>
        <Row>
          <Col sm={12}>
            <Form inline className="table-filters">
              { this.renderFilters() }
            </Form>
          </Col>
        </Row>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
            {
              this.props.fields
              ? this.renderHeader(Object.keys(this.props.fields))
              : null
            }
            </tr>
          </thead>
          <tbody>
            {
              this.state.filteredData 
              ? this.renderRows(this.state.filteredData)
              : null
            }
          </tbody>
        </Table>    
      </div>
    )
  }
}

export default FilterableTable