import React, { Component } from 'react';
import ProjectList from './components/project_list';
import './App.css';

export default class App extends Component {
  render() {
    return (
      <div className="row">
        <ProjectList category="os" branch="master" />
        <ProjectList category="os" branch="release-v3.0" />
        <ProjectList category="os" branch="release-v2.6" />
      </div>
    )
  }
};