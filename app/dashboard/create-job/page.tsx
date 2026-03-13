"use client"

import { useState } from 'react'
import CreateJobForm from '../components/CreateJobForm'
import ApplicationFormBuilder from '../components/ApplicationFormBuilder'
import CreateTestForm from '../components/CreateTestForm'
import CreateQuestionForm from '../components/CreateQuestionForm'

type Tab = 'create-job' | 'application' | 'test' | 'question'

function CreateJob() {
  const [activeTab, setActiveTab] = useState<Tab>('create-job')

  const tabClass = (tab: Tab) =>
    `px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
      activeTab === tab
        ? 'border-indigo-600 text-indigo-600'
        : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
    }`

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Horizontal Tabs */}
      <div className="flex border-b border-slate-200">
        <button type="button" className={tabClass('create-job')} onClick={() => setActiveTab('create-job')}>
          Create a Job
        </button>
        <button type="button" className={tabClass('application')} onClick={() => setActiveTab('application')}>
          Application
        </button>
        <button type="button" className={tabClass('test')} onClick={() => setActiveTab('test')}>
          Test
        </button>
        <button type="button" className={tabClass('question')} onClick={() => setActiveTab('question')}>
          Question
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === 'create-job' && <CreateJobForm />}
        {activeTab === 'application' && <ApplicationFormBuilder />}
        {activeTab === 'test' && <CreateTestForm />}
        {activeTab === 'question' && <CreateQuestionForm />}
      </div>
    </div>
  )
}

export default CreateJob
