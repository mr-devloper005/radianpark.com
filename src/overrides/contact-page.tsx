'use client'

import { useState } from 'react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SITE_CONFIG } from '@/lib/site-config'
import { siteIdentity } from '@/config/site.identity'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail, MapPin, Phone, Clock, ArrowRight, CheckCircle2 } from 'lucide-react'

export const CONTACT_PAGE_OVERRIDE_ENABLED = true

export function ContactPageOverride() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  const contactMethods = [
    {
      icon: Mail,
      label: 'Email us',
      value: siteIdentity.contactEmail,
      href: `mailto:${siteIdentity.contactEmail}`,
      description: 'We reply within 24 hours',
    },
    {
      icon: Phone,
      label: 'Call us',
      value: '+1 (555) 123-4567',
      href: 'tel:+15551234567',
      description: 'Mon-Fri from 9am to 6pm',
    },
    {
      icon: MapPin,
      label: 'Visit us',
      value: '123 Innovation Drive',
      href: '#',
      description: 'San Francisco, CA 94102',
    },
    {
      icon: Clock,
      label: 'Working hours',
      value: 'Mon - Fri',
      href: '#',
      description: '9:00 AM - 6:00 PM PST',
    },
  ]

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fdfdfd_0%,#f5f6f8_48%,#ffffff_100%)] text-zinc-950">
      <NavbarShell />

      {/* Hero Section - Fundable-inspired with clean stats bar */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
              Get in touch
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
              Contact {SITE_CONFIG.name}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
              Have a question or want to collaborate? We are here to help you build 
              something amazing together.
            </p>
          </div>

          {/* Stats Bar - Fundable-inspired horizontal metrics */}
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {[
              { value: '24h', label: 'Response time' },
              { value: '99%', label: 'Satisfaction rate' },
              { value: '10k+', label: 'Happy users' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-full border border-zinc-200 bg-zinc-50 px-6 py-3"
              >
                <span className="text-2xl font-bold text-zinc-950">{stat.value}</span>
                <span className="text-sm text-zinc-500">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          {/* Left Column - Contact Methods */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
                Ways to reach us
              </h2>
              <p className="mt-3 text-zinc-600">
                Choose the method that works best for you. Our team is ready to assist.
              </p>
            </div>

            {/* Contact Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {contactMethods.map((method) => (
                <a
                  key={method.label}
                  href={method.href}
                  className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 transition-colors group-hover:bg-zinc-900">
                    <method.icon className="h-5 w-5 text-zinc-600 transition-colors group-hover:text-white" />
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    {method.label}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-zinc-950">{method.value}</p>
                  <p className="mt-1 text-sm text-zinc-500">{method.description}</p>
                </a>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
              <h3 className="text-lg font-semibold text-zinc-950">Quick actions</h3>
              <div className="mt-4 space-y-3">
                {[
                  { label: 'Browse help center', href: '/help' },
                  { label: 'View documentation', href: '/docs' },
                  { label: 'Report an issue', href: '/report' },
                ].map((action) => (
                  <a
                    key={action.label}
                    href={action.href}
                    className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
                  >
                    {action.label}
                    <ArrowRight className="h-4 w-4 text-zinc-400" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-[0_24px_70px_rgba(24,24,27,0.08)]">
            {isSubmitted ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-zinc-950">Message sent!</h3>
                <p className="mt-3 max-w-sm text-zinc-600">
                  Thank you for reaching out. We have received your message and will 
                  get back to you at {formData.email} within 24 hours.
                </p>
                <Button
                  onClick={() => {
                    setIsSubmitted(false)
                    setFormData({ name: '', email: '', subject: '', message: '' })
                  }}
                  className="mt-8 rounded-full bg-zinc-950 px-8 hover:bg-zinc-800"
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
                  Send us a message
                </h2>
                <p className="mt-3 text-zinc-600">
                  Fill out the form below and we will get back to you as soon as possible.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-700">Your name</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="h-12 rounded-xl border-zinc-200 bg-zinc-50 text-zinc-950 placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-700">Email address</label>
                      <Input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="h-12 rounded-xl border-zinc-200 bg-zinc-50 text-zinc-950 placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">Subject</label>
                    <Input
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="How can we help?"
                      className="h-12 rounded-xl border-zinc-200 bg-zinc-50 text-zinc-950 placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">Message</label>
                    <Textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us more about your inquiry..."
                      rows={5}
                      className="rounded-xl border-zinc-200 bg-zinc-50 text-zinc-950 placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="h-12 w-full rounded-full bg-zinc-950 text-base font-semibold hover:bg-zinc-800"
                  >
                    Send message
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <p className="text-center text-xs text-zinc-500">
                    By submitting this form, you agree to our{' '}
                    <a href="/privacy" className="underline hover:text-zinc-700">Privacy Policy</a>
                    {' '}and{' '}
                    <a href="/terms" className="underline hover:text-zinc-700">Terms of Service</a>.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
