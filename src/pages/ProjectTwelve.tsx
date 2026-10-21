import { Link } from 'react-router-dom';
// The section's graphic, animated (the PNG is its finished still, for reduced motion).
import chargeTransactions from '../assets/Charge_transactions.svg';
import chargeTransactionsStill from '../assets/Charge_transactions_still.png';
// From the design file: an answer as it appears in the chat, and the Yes/No presets
// added in revision.
import chargeTypography from '../assets/Charge_typography_1720x1300.png';
import chargePresets from '../assets/Charge_presets_1000x1000.png';
import { ProjectHorizontalLayout } from '../components/ProjectHorizontalLayout';
import { ImageStripNav } from '../components/ImageStrip';
import type { StripImage } from '../components/ImageStrip';
import screenIntentClear from '../assets/Charge_screen_intent_clear.png';
import screenIntentUnclear from '../assets/Charge_screen_intent_unclear.png';
import screenIntentNotCharge from '../assets/Charge_screen_intent_not_charge.png';
import screenJustDate from '../assets/Charge_screen_just_date.png';
import screenJustAmount from '../assets/Charge_screen_just_amount.png';
import screenAskAgain from '../assets/Charge_screen_ask_again.png';
import screenMatch from '../assets/Charge_screen_match.png';
import screenNear from '../assets/Charge_screen_near.png';
import screenNearMulti from '../assets/Charge_screen_near_multi.png';
import screenNone from '../assets/Charge_screen_none.png';
import screenYes from '../assets/Charge_screen_yes.png';
import screenNo from '../assets/Charge_screen_no.png';
import screenRecent from '../assets/Charge_screen_recent.png';
import screenAmc from '../assets/Charge_screen_amc.png';

const SCREEN = 414 / 896;

// Section 02: how the agent finds out what to look for.
const askScreens: StripImage[] = [
  {
    src: screenIntentClear,
    label: 'Clear request',
    alt: 'The player types "I don’t recognize a charge on my account" and the agent asks straight away for the date and amount of the charge',
    aspect: SCREEN,
    caption: 'A player who names the charge goes straight to the one question that matters.',
  },
  {
    src: screenIntentUnclear,
    label: 'Unclear request',
    alt: 'The player types "I don’t recognize something"; the agent asks whether they mean an unrecognized charge and offers to look in their Xbox purchase history',
    aspect: SCREEN,
    caption: '“Something” could be anything, so the agent checks before it searches.',
  },
  {
    src: screenIntentNotCharge,
    label: 'Not a charge',
    alt: 'The player answers No to the agent’s offer, and the agent asks what else it can help with',
    aspect: SCREEN,
    caption: 'A No lets the player go, without walking them through a lookup they didn’t want.',
  },
  {
    src: screenJustDate,
    label: 'Just a date',
    alt: 'The player gives only a date; the agent repeats it back and asks whether it’s correct, then lists the charges on that day',
    aspect: SCREEN,
    caption: 'Half an answer is enough to search on. The agent repeats it back before it looks.',
  },
  {
    src: screenJustAmount,
    label: 'Just an amount',
    alt: 'The player gives only an amount; the agent confirms it and lists the charges for that amount on several dates',
    aspect: SCREEN,
    caption: 'An amount alone finds every charge for that amount, whatever the date.',
  },
  {
    src: screenAskAgain,
    label: 'Not what I said',
    alt: 'The agent repeats back the wrong amount; the player answers No, and the agent asks again for the date and amount',
    aspect: SCREEN,
    caption: 'If the agent misread the player, a No sends it back to the question, not off on a wrong search.',
  },
];

// Section 03: the answers a search can come back with, and what follows each.
const resultScreens: StripImage[] = [
  {
    src: screenMatch,
    label: 'A match',
    alt: 'The agent says “Ahhh yes, I’ve found a match for that” and shows the charge: June 1, 2025, $22.01, S.T.A.L.K.E.R.: Shadow of Chernobyl',
    aspect: SCREEN,
    caption: 'An exact match is named plainly: the date, the amount, and what was bought.',
  },
  {
    src: screenNear,
    label: 'A near match',
    alt: 'The agent says there’s no exact match, but there is a near match, and shows a charge for the same amount on a nearby date',
    aspect: SCREEN,
    caption: 'No exact match, but one close by, and the agent says so rather than passing it off as the answer.',
  },
  {
    src: screenNearMulti,
    label: 'Near matches',
    alt: 'The agent lists three charges for $22.01 on dates near the one given, the matching amounts in bold',
    aspect: SCREEN,
    caption: 'What matches what the player typed is bold, so they can see why each one is there.',
  },
  {
    src: screenNone,
    label: 'No match',
    alt: 'The agent says there are no matches and shows the player’s five most recent purchases, one of them a multi-item order with its order number',
    aspect: SCREEN,
    caption: 'Nothing found still isn’t a dead end: the five most recent purchases, in case one is it.',
  },
  {
    src: screenYes,
    label: 'Resolved',
    alt: 'The player answers Yes to “Is this the information you are looking for?” and the agent asks if there’s anything else it can help with',
    aspect: SCREEN,
    caption: 'Every answer ends on one question, and a Yes closes the loop.',
  },
  {
    src: screenNo,
    label: 'Not resolved',
    alt: 'The player answers No, and the agent offers to show their five most recent purchases',
    aspect: SCREEN,
    caption: 'A No widens the search to the most recent purchases.',
  },
  {
    src: screenRecent,
    label: 'Recent purchases',
    alt: 'The agent lists the player’s five most recent purchases and asks whether this is the information they’re looking for',
    aspect: SCREEN,
    caption: 'The same layout as every other answer, so there’s nothing new to read.',
  },
  {
    src: screenAmc,
    label: 'Where to look next',
    alt: 'The agent explains how to search by payment method at account.microsoft.com, with links to check account history and review purchase history',
    aspect: SCREEN,
    caption:
      'Past what the agent can see, it hands over the exact steps and a link: search by payment method at account.microsoft.com.',
  },
];

export const ProjectTwelve = () => (
  <ProjectHorizontalLayout
    panels={[
      {
        sectionLabel: '01 / Overview',
        heading: 'Unrecognized Charge: Purchase Lookup',
        content: (
          <>
            <p data-role="subtitle">
              Turning “I don’t recognize this charge” into a name, a date and an answer
            </p>
            <p>
              Finding a charge you don’t recognize on a bank statement is worrying. Most of the time
              it isn’t fraud. It’s a purchase that’s hard to place: several items in one order, a name
              on the statement that doesn’t match the game, or something a family member bought. To
              find out, players had to dig through their order history, and many went straight to
              live support instead.
            </p>
            <p>
              I led the design of a purchase lookup for the Unrecognized Charge Agent in the Xbox
              Support Virtual Agent. It asks for the date and amount, searches the player’s Xbox
              purchase history, and names the charge in plain language. When there’s no clear
              answer, it shows what’s closest, or where to look next. It builds on{' '}
              <Link to="/project/unrecognized-charge-agent">the agent’s first phase</Link>, which
              moved its answers from text links to adaptive cards.
            </p>
            <h3>At a glance</h3>
            <ul>
              <li>
                <span>Role:</span> Lead Designer
              </li>
              <li>
                <span>Surface:</span> Support Virtual Agent (web, mobile web)
              </li>
              <li>
                <span>Timeline:</span> 2025
              </li>
              <li>
                <span>Partners:</span> PM, Engineering
              </li>
            </ul>
          </>
        ),
        imageSlot: {
          type: 'image',
          src: chargeTransactions,
          stillSrc: chargeTransactionsStill,
          replayOnView: true,
          maxSideCrop: 212,
          alt: 'A table of recent transactions fills in, and the agent hones in on the one charge in question and names it plainly in the chat',
        },
      },
      {
        sectionLabel: '02 / Conversation',
        heading: 'Ask for two things, then confirm them',
        content: (
          <>
            <p>
              The agent asks only for what identifies a charge, the date and the amount, and repeats
              them back before it searches. Step through the ways a conversation can open, or scroll
              the screens sideways.
            </p>
            <ImageStripNav id="charge-ask" images={askScreens} matchScreens dragHint />
          </>
        ),
        imageSlot: {
          type: 'strip',
          id: 'charge-ask',
          images: askScreens,
          flowArrows: true,
          uniformWidth: true,
          outlined: true,
        },
        layout: 'mediaBelow',
      },
      {
        sectionLabel: '03 / Answers',
        heading: 'Match, near match, no match',
        content: (
          <>
            <p>
              Every search ends in one of three places, each with its own wording, and every answer
              asks the same question: is this what you were looking for?
            </p>
            <ImageStripNav id="charge-results" images={resultScreens} matchScreens dragHint />
          </>
        ),
        imageSlot: {
          type: 'strip',
          id: 'charge-results',
          images: resultScreens,
          flowArrows: true,
          uniformWidth: true,
          outlined: true,
        },
        layout: 'mediaBelow',
      },
      {
        sectionLabel: '04 / Typography',
        heading: 'Typography that reads like a statement',
        content: (
          <>
            <p>
              Here the typography is the interface: a few lines of text in a chat bubble that have
              to match the statement the player is holding. When it works, nobody notices it.
            </p>
            <p>
              <span>A statement, not a list.</span> Purchases are deliberately not bulleted. A
              bulleted list reads like a chatbot’s search results. A statement reads like a record,
              and a record is what the player will trust. So the layout follows the statement: an
              unordered list with its markers removed, date and amount on one line, the title on the
              next, and 12px of space between purchases.
            </p>
            <p>
              <span>The number on the statement.</span> Each purchase leads with its total
              including tax, as account.microsoft.com records it. Items in an order are indented
              12px with their prices before tax, and the order number sits in Gray 130, there to
              reference but not to compete.
            </p>
            <p>
              <span>Bold is evidence.</span> Only what exactly matches the player’s search is bold.
              In a near match, the amount can be bold while the date isn’t, so the player sees what
              matched without being told.
            </p>
            <p>
              <span>One system.</span> Matches, near matches and recent purchases all use the same
              pattern, so the player learns it once. A divider sets the answer apart from the
              feedback controls.
            </p>
          </>
        ),
        imageSlot: {
          type: 'image',
          src: chargeTypography,
          alt: 'The agent’s answer in the chat: “Ok, I’ve found a few matches.” A June 1 order of $89.99 (total), its order number in grey and three items indented beneath with their own prices; then two single purchases of $22.01. The matching amounts are bold. A divider separates the answer from the thumbs up and down buttons and the AI-generated content notice.',
          fit: 'contain',
          background: '#edebe9',
        },
      },
      {
        sectionLabel: '05 / Hand-off',
        heading: 'One tap to confirm',
        content: (
          <>
            <p>
              The spec went to engineering in June 2025 as three parts: the anatomy of a charge,
              every conversation scenario with its strings, and an example conversation mapping how
              each path leads to the next.
            </p>
            <p>
              A revision in December tightened the flow in three places. The agent’s confirmation
              (“I’ll look for charges on February 24, 2025 for $22.01. Is that correct?”) got Yes
              and No buttons, so the player can confirm with one tap instead of typing a reply, and
              the flow was rebuilt around them. A divider set the feedback controls apart from the
              conversation. And the closing question became “Is this the information you are
              looking for?”, so it asks about the answer the player was just shown.
            </p>
            <p>
              The result is a lookup that does what the player would otherwise have done by hand:
              find the charge, name it, and, when it can’t, say exactly where to look next.
            </p>
          </>
        ),
        imageSlot: {
          type: 'image',
          src: chargePresets,
          alt: 'Three of the agent’s confirmations, each with Yes and No buttons: one repeating back a date and an amount, one a date alone, and one an amount alone',
          fit: 'contain',
          background: '#f5f5f5',
        },
      },
    ]}
  />
);
