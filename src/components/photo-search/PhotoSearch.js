import React, { Component } from "react";
import { Row, Col } from 'antd';

import PhotoSearchBar from './PhotoSearchBar';
import PhotoSearchResult from './PhotoSearchResult';

import { unsplash } from '../../utils';

class PhotoSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: '',
      currentPage: 1,
      dataResult: '',
    };

    this.pageSize = 12;
  }

  getTheKeyword = (keyword) => {
    this.setState({
      keyword: keyword,
      currentPage: 1
    });

    this.doSearch(keyword, this.state.currentPage);
  };

  onPageChange = (newPage) => {
    this.setState({
      currentPage: newPage
    });

    this.doSearch(this.state.keyword, newPage);
  };

  doSearch = (keyword, currentPage) => {
    unsplash.search
      .getPhotos(
        { query: keyword, page: currentPage, perPage: this.pageSize }, 
        { headers: { 'X-Custom-Header': 'foo' } } // Optional, add if needed
      )
      .then(result => {
        if (result.type === 'success') {
          console.log('Search Results:', result.response.results); // Handle successful search response
          this.setState({
            dataResult: result.response.results
          });
        } else {
          console.error('Search Errors:', result.errors); // Handle errors
        }
      })
      .catch(error => {
        console.error('Search Error:', error); // Handle any other errors
      });
  };  
  

  SelectPhoto = (photoData) => {
    this.props.selectCover(photoData);
  };

  render() {
    return (
      <div style={{marginTop: 12}}>
        <Row type="flex"  justify="center" align="middle">
          <Col style={{width: '300px'}}>
            <PhotoSearchBar getTheKeyword={this.getTheKeyword}/>
          </Col>
        </Row>
        <Row type="flex" justify="center" align="middle">
          <Col>
            <PhotoSearchResult
              data={this.state.dataResult}
              onSelect={this.SelectPhoto}
              currentPage={this.state.currentPage}
              pageSize={this.pageSize}
              onPageChange={this.onPageChange}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default PhotoSearch;