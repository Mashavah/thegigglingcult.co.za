import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ComedianCard, EventCard, NewsCard } from '@/components/Cards';
import { Icon } from '@/components/Icons';
import { COMEDIANS, NEWS, VENUES } from '@/lib/data';
import { fmt } from '@/lib/dates';
import { upcomingEvents } from '@/lib/queries';

export default function Home() {
  const upcoming = upcomingEvents();
  const ticker = upcoming.slice(0, 12);
  const featuredComedians = COMEDIANS.slice(0, 4);

  return (
    <>
      {/* Upcoming shows ticker — directly below the global navigation */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...ticker, ...ticker].map((event, i) => (
            <span key={`${event.id}-${i}`}>
              {fmt.relative(event.date)} <b>{event.title}</b> {VENUES[event.venue].name}
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section className="hero">
        <div className="hero-media" aria-hidden="true">
          <Image src="/img/hero.jpg" alt="" fill priority sizes="100vw" />
        </div>

        <div className="container hero-inner">
          <span
            className="eyebrow enter"
            style={{ '--i': 0 } as CSSProperties}
          >
            The Giggling Cult
          </span>

          <h1
            className="enter hero-title"
            style={{ '--i': 1 } as CSSProperties}
          >
            HOME OF <em>SA COMEDY</em>
          </h1>

          <p
            className="lead enter"
            style={{ '--i': 2 } as CSSProperties}
          >
            Discover shows. Meet comedians. Celebrate South African comedy.
            <br />
            No robes. No rituals. Just laughing in a dark room with strangers.
          </p>

          <div
            className="hero-actions enter"
            style={{ '--i': 3 } as CSSProperties}
          >
            <Link className="btn btn-primary btn-lg" href="/events">
              Explore Events
            </Link>

            <Link className="btn btn-ghost btn-lg" href="/comedians">
              Browse Comedians
            </Link>
          </div>
        </div>
      </section>

      {/* Homepage event preview — full listings remain on /events */}
      <section className="section home-events" style={{ background: '#540B0E' }}>
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Laughs ahead</span>
              <h2>This Week in SA Comedy</h2>
              <p className="muted">
                A quick look at what&apos;s coming up. View the full calendar for more shows.
              </p>
            </div>

            <Link className="btn btn-ghost btn-sm" href="/events">
              View All Events
            </Link>
          </div>

          <div
            className="grid grid-4"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}
          >
            {upcoming.slice(0, 4).map((event, i) => (
              <EventCard key={event.id} e={event} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured comedians */}
      <section
        className="section home-comedians"
        style={{ background: '#FFF3B0', color: '#111111' }}
      >
        <div className="container">
          <div
            className="section-head"
            style={{ borderBottomColor: 'rgba(17, 17, 17, 0.18)' }}
          >
            <div>
              <span className="eyebrow" style={{ color: '#540B0E' }}>
                Meet the cult
              </span>
              <h2 style={{ color: '#111111' }}>Featured Comedians</h2>
            </div>

            <Link className="btn btn-soft btn-sm" href="/comedians">
              See All Comedians
            </Link>
          </div>

          <div
            className="grid grid-4"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}
          >
            {featuredComedians.map((comedian, i) => (
              <ComedianCard key={comedian.slug} c={comedian} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest news */}
      <section className="section home-news" style={{ background: '#335C67' }}>
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">In the know</span>
              <h2>Latest News</h2>
              <p className="muted">
                Stories, spotlights and everything happening in South African comedy.
              </p>
            </div>

            <Link className="btn btn-ghost btn-sm" href="/news">
              See All News
            </Link>
          </div>

          <div className="grid grid-3">
            {NEWS.slice(0, 3).map((article, i) => (
              <NewsCard key={article.slug} n={article} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Join the Cult — Audience, Comedians and Venues */}
      <section className="section home-join" style={{ background: '#9E2A2B' }}>
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Be part of it</span>
              <h2>Join the Cult</h2>
              <p className="muted">
                Whether you&apos;re in the crowd, on stage or running the venue — there&apos;s a place for you here.
              </p>
            </div>
          </div>

          <div
            className="join-split"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}
          >
            <Link className="join-tile" href="/join?as=audience">
              <span className="tag" style={{ alignSelf: 'flex-start' }}>
                Audience Members
              </span>
              <h3>One email a week. Zero spam. Mostly jokes.</h3>
              <p>
                Pick your province and get comedy news, show updates, sold-out warnings and new faces worth seeing.
              </p>
              <span className="arrow">
                Sign up as audience <Icon.arrow />
              </span>
            </Link>

            <Link className="join-tile" href="/join?as=comedian">
              <span className="tag tag-accent" style={{ alignSelf: 'flex-start' }}>
                Comedians
              </span>
              <h3>Get on the list. The good list.</h3>
              <p>
                Add your profile, share your socials and make it easier for audiences to discover your upcoming shows.
              </p>
              <span className="arrow">
                Join as a comedian <Icon.arrow />
              </span>
            </Link>

            <Link className="join-tile" href="/join?as=venue">
              <span className="tag" style={{ alignSelf: 'flex-start' }}>
                Venues
              </span>
              <h3>Put your comedy night on the map.</h3>
              <p>
                List your venue, share your comedy nights and put your room in front of South Africa&apos;s comedy crowd.
              </p>
              <span className="arrow">
                Join as a venue <Icon.arrow />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
