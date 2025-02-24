import Link from 'next/link'
import React from 'react'

import { allPlansObj } from '@devhub/core/dist'
import LandingLayout from '../components/layouts/LandingLayout'
import GitHubLoginButton from '../components/sections/login/GitHubLoginButton'
import { useAuth } from '../context/AuthContext'
import { formatPrice, getTrialTimeLeftLabel } from '../helpers'

export interface AccountPageProps {}

export default function AccountPage(_props: AccountPageProps) {
  const { authData, cancelSubscription, deleteAccount, logout } = useAuth()

  const planInfo = authData.plan && allPlansObj[authData.plan.id]

  function renderContent() {
    if (!(authData.appToken && authData.github && authData.github.login)) {
      return (
        <>
          <img
            alt="DevHub logo"
            className="w-20 h-20 mb-8 bg-primary border-4 border-bg-less-2 rounded-full"
            src="/static/logo.png"
          />

          <GitHubLoginButton />
        </>
      )
    }

    return (
      <>
        <img
          alt="Your GitHub profile logo"
          className="w-20 h-20 mb-8 bg-primary border-4 border-bg-less-2 rounded-full"
          src={`https://github.com/${authData.github.login}.png`}
        />

        <h1 className="mb-4 text-2xl sm:text-4xl whitespace-no-wrap">
          {authData.github.name || authData.github.login}
        </h1>

        <h2 className="mb-0 text-xl sm:text-2xl">
          {!!(planInfo && authData.plan) ? (
            <>
              Current plan: <strong>{planInfo.label}</strong>{' '}
              {authData.plan.amount > 0 && (
                <small>
                  (
                  {`${authData.plan.currency.toUpperCase()} ${formatPrice(
                    authData.plan.amount,
                    authData.plan.currency,
                  )}/${authData.plan.interval || 'month'}`}
                  )
                </small>
              )}
            </>
          ) : (
            'Free plan'
          )}
        </h2>

        {!!(authData.plan && authData.plan.status) && (
          <h2 className="mb-0 text-md sm:text-xl">
            {authData.plan.status === 'trialing'
              ? authData.plan.trialEndAt &&
                authData.plan.trialEndAt > new Date().toISOString()
                ? `Status: ${authData.plan.status} (${getTrialTimeLeftLabel(
                    authData.plan.trialEndAt,
                  )})`
                : 'Status: trial ended'
              : `Status: ${authData.plan.status}`}
          </h2>
        )}

        <div className="pb-4" />

        {authData.plan && authData.plan.amount > 0 ? (
          <>
            <Link href="/pricing">
              <a className="text-default">Switch plan</a>
            </Link>

            <Link
              href={`/subscribe${
                planInfo && planInfo.cannonicalId
                  ? `?plan=${planInfo.cannonicalId}`
                  : ''
              }`}
            >
              <a className="text-default">Update credit card</a>
            </Link>

            <a
              href="javascript:void(0)"
              className="text-default"
              onClick={() => cancelSubscription(true)}
            >
              Cancel subscription
            </a>
          </>
        ) : (
          <>
            <Link href="/pricing">
              <a className="text-default">Subscribe to a plan</a>
            </Link>
          </>
        )}

        <a
          href="javascript:void(0)"
          className="text-default"
          onClick={() => deleteAccount(true)}
        >
          Delete account
        </a>

        <a
          href="javascript:void(0)"
          className="text-default"
          onClick={() => logout()}
        >
          Logout
        </a>
      </>
    )
  }

  return (
    <LandingLayout>
      <section id="subscribe" className="container">
        <div className="flex flex-col items-center m-auto text-center">
          {renderContent()}
        </div>
      </section>
    </LandingLayout>
  )
}
