import React, { Component } from 'react';

import axios from 'axios';

const API_KEY = process.env.REACT_APP_SEMAPHORE_KEY;
const ROOT_URL = `https://semaphoreci.com/api/v1`;
const url = `${ROOT_URL}/projects?auth_token=${API_KEY}`

const projectCat = {
  "os": [
    "typha",
    "felix",
    "calico",
    "calicoctl",
    "libcalico-go",
    "cni-plugin",
    "kube-controllers",
  ],
  "istio": [
    "dikastes",
    "pilot-webhook",
  ],
  "build": [
    "go-build",
  ],
}

export default class ProjectList extends Component {
  constructor(props) {
    super(props);
    this.category = props.category
    if (props.branch) {
      this.branch = props.branch
    } else {
      this.branch = "master"
    }
    this.state = {
      projects: [],
      lastUpdated: null
    }
  }

  componentDidMount(){
    this.update()
    setInterval(this.update.bind(this), 10000)
  }

  update() {
    axios.get(url)
      .then((res) => {
        this.setState({projects: res.data, lastUpdated: Date.now()});
      })
  }

  renderList() {
    return this.state.projects.map((project) => {
      if (!projectCat[this.category].includes(project.name)) {
        return
      }

      var job = project.branches.find(function (obj) { return obj.branch_name === this.branch; }, this);
      if (!job) {
        console.log("Couldn't find branch " + this.branch + " for repo " + project.name)
        return
      }

      var color = {
        "passed": "list-group-item-success",
        "failed": "list-group-item-danger",
        "pending": "list-group-item-info"
      }

      return (
        <li key={project.id} className={color[job.result] + " list-group-item d-flex justify-content-between"}>
        {project.name}
        <span className="badge badge-pill">{this.statusIcon(job.result)}</span>

        </li>
      )
    })
  }

  statusIcon(result) {
    switch(result) {
      case 'passed':
        return <i class="fa fa-check"></i>
      case 'failed':
        return <i class="fa fa-times"></i>
      case 'pending':
        return <i class="fa fa-refresh"></i>
    }
  }

  render() {
    return (
      <div className="col-sm-4">
        <h3>{this.branch}</h3>
        <ul className="list-group">
          {this.renderList()}
        </ul>
        <small>Last updated: {this.prettyDate(this.state.lastUpdated)}</small>
      </div>
    )
  }

  prettyDate(date) {
    var d = new Date(date)
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  }
}
