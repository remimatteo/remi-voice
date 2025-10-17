/**
 * Subscription utility functions
 *
 * NOTE: These are placeholder functions that currently return mock data.
 * When you add a database, update these functions to query real subscription data.
 */

/**
 * Check if a user has an active subscription
 * @param {string} userId - Clerk user ID
 * @returns {Promise<boolean>}
 */
export async function hasActiveSubscription(userId) {
  // TODO: Query your database for user's subscription
  // Example:
  // const subscription = await db.subscriptions.findOne({ clerkUserId: userId })
  // return subscription && subscription.status === 'active'

  console.log('Checking subscription for user:', userId)
  return false // Placeholder - update when you add a database
}

/**
 * Get user's subscription details
 * @param {string} userId - Clerk user ID
 * @returns {Promise<object|null>}
 */
export async function getSubscription(userId) {
  // TODO: Query your database for user's subscription details
  // Example:
  // return await db.subscriptions.findOne({ clerkUserId: userId })

  console.log('Fetching subscription for user:', userId)
  return null // Placeholder - update when you add a database
}

/**
 * Check if user is in trial period
 * @param {string} userId - Clerk user ID
 * @returns {Promise<boolean>}
 */
export async function isInTrial(userId) {
  // TODO: Check if user's trial period is still active
  // Example:
  // const subscription = await getSubscription(userId)
  // if (!subscription || !subscription.trialEnd) return false
  // return new Date(subscription.trialEnd) > new Date()

  console.log('Checking trial status for user:', userId)
  return false // Placeholder - update when you add a database
}

/**
 * Get days remaining in trial
 * @param {string} userId - Clerk user ID
 * @returns {Promise<number>}
 */
export async function getTrialDaysRemaining(userId) {
  // TODO: Calculate days remaining in trial
  // Example:
  // const subscription = await getSubscription(userId)
  // if (!subscription || !subscription.trialEnd) return 0
  // const now = new Date()
  // const trialEnd = new Date(subscription.trialEnd)
  // const diffTime = trialEnd - now
  // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  // return diffDays > 0 ? diffDays : 0

  console.log('Calculating trial days for user:', userId)
  return 7 // Placeholder - update when you add a database
}

/**
 * Database Schema Suggestion
 *
 * When you're ready to add a database, create a table/collection with this structure:
 *
 * subscriptions {
 *   id: string (primary key)
 *   clerkUserId: string (indexed, unique)
 *   stripeCustomerId: string
 *   stripeSubscriptionId: string
 *   stripePriceId: string
 *   status: string ('active', 'canceled', 'past_due', 'trialing')
 *   currentPeriodStart: timestamp
 *   currentPeriodEnd: timestamp
 *   trialStart: timestamp (nullable)
 *   trialEnd: timestamp (nullable)
 *   cancelAtPeriodEnd: boolean
 *   createdAt: timestamp
 *   updatedAt: timestamp
 * }
 *
 * Then update the webhook handler (pages/api/stripe-webhook.js) to:
 * 1. Create subscription record on checkout.session.completed
 * 2. Update subscription status on customer.subscription.updated
 * 3. Mark as canceled on customer.subscription.deleted
 */
