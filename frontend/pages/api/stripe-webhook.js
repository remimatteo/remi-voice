import Stripe from 'stripe'
import { buffer } from 'micro'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

// Disable body parser to get raw body for webhook verification
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const buf = await buffer(req)
  const sig = req.headers['stripe-signature']

  let event

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        console.log('Checkout session completed:', session.id)

        // Get the Clerk user ID from metadata
        const clerkUserId = session.metadata?.clerk_user_id || session.client_reference_id

        // Here you would typically:
        // 1. Store subscription info in your database
        // 2. Update user's subscription status
        // 3. Send confirmation email

        console.log('User subscribed:', {
          clerkUserId,
          customerId: session.customer,
          subscriptionId: session.subscription,
        })
        break
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object
        console.log('Subscription created:', subscription.id)

        // Store subscription details
        console.log('Subscription details:', {
          customerId: subscription.customer,
          status: subscription.status,
          trialEnd: subscription.trial_end,
        })
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object
        console.log('Subscription updated:', subscription.id)

        // Update subscription status in your database
        console.log('Subscription status:', subscription.status)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        console.log('Subscription canceled:', subscription.id)

        // Update user's subscription status to canceled
        console.log('Subscription ended for customer:', subscription.customer)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object
        console.log('Payment succeeded:', invoice.id)

        // Confirm payment and extend subscription
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        console.log('Payment failed:', invoice.id)

        // Notify user of payment failure
        // Consider suspending access
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    res.status(200).json({ received: true })
  } catch (error) {
    console.error('Error handling webhook event:', error)
    res.status(500).json({ error: 'Webhook handler failed' })
  }
}
