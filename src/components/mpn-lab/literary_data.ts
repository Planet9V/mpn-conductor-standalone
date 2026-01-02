import { LiteraryScenario } from './types';

export const LITERARY_SCENARIOS: LiteraryScenario[] = [
    {
        id: 'hamlet',
        title: 'Hamlet',
        author: 'Shakespeare',
        theme: 'Mousetrap to Catastrophe',
        color: '#3b82f6',
        frames: [
            // ACT I
            {
                name: 'Battlements Watch',
                description: 'Bernardo and Francisco on guard. "Who\'s there?"',
                trauma: 0.1, entropy: 0.2, focusLayer: 0,
                script: { speaker: 'Bernardo', text: "Who's there?", chord: 'Dmin (fp)', analysis: 'The fundamental question of identity. Brief, unstable D minor triad.' }
            },
            {
                name: 'Horatio Arrives',
                description: '"Tush, tush, \'twill not appear." Skepticism of the Symbolic order.',
                trauma: 0.1, entropy: 0.3, focusLayer: 4,
                script: { speaker: 'Horatio', text: "Tush, tush, 'twill not appear.", chord: 'F Major', analysis: 'Rationality (Symbolic) attempting to deny the Real.' }
            },
            {
                name: 'Ghost Appears',
                description: 'The figure of the dead King enters. "Looks it not like the king?"',
                trauma: 0.4, entropy: 0.4, focusLayer: 0,
                script: { speaker: 'Marcellus', text: "Peace, break thee off; look, where it comes again!", chord: 'C#dim7/D', analysis: 'The Real ruptures the screen of reality. Diminished tension over a D pedal.' }
            },
            {
                name: 'Ghost Stalks Away',
                description: 'It refuses to speak. "Stay! speak, speak! I charge thee, speak!"',
                trauma: 0.5, entropy: 0.5, focusLayer: 0,
                script: { speaker: 'Horatio', text: "Stay! speak, speak! I charge thee, speak!", chord: 'Tremolo Strings', analysis: 'Symbolic command fails. The Real does not answer to the Signifier.' }
            },
            {
                name: 'Claudius Court',
                description: '"Though yet of Hamlet our dear brother\'s death..." The false stability of the Usurper.',
                trauma: 0.2, entropy: 0.1, focusLayer: 5,
                script: { speaker: 'Claudius', text: "Our sometime sister, now our queen...", chord: 'Eb Major (Pomp)', analysis: 'Brass fanfare. Over-compensation of the Symbolic Order to mask the rot.' }
            },
            {
                name: 'Too Much Sun',
                description: '"A little more than kin, and less than kind." Hamlet\'s first aside.',
                trauma: 0.3, entropy: 0.6, focusLayer: 4,
                script: { speaker: 'Hamlet', text: "A little more than kin, and less than kind.", chord: 'Eb Minor (Bitonal)', analysis: 'The Minor clash against the Court\'s Major key. Subjective interiority.' }
            },
            {
                name: 'Solid Flesh',
                description: '"O, that this too too solid flesh would melt..." First Soliloquy.',
                trauma: 0.7, entropy: 0.5, focusLayer: 3,
                script: { speaker: 'Hamlet', text: "O, that this too too solid flesh would melt...", chord: 'Gmin/Bb', analysis: 'Descending bass line (Lament). Desire for dissolution of the Imaginary body.' }
            },
            {
                name: 'Frailty',
                description: '"Frailty, thy name is woman!" The mother as the site of lack.',
                trauma: 0.6, entropy: 0.7, focusLayer: 3,
                script: { speaker: 'Hamlet', text: "Frailty, thy name is woman!", chord: 'Ddim', analysis: 'Collapse of the Maternal Ideal. The "Woman" does not exist (Lacan).' }
            },
            {
                name: 'Horatio\'s News',
                description: '"My lord, I think I saw him yesternight." The meeting of friends.',
                trauma: 0.3, entropy: 0.4, focusLayer: 4,
                script: { speaker: 'Horatio', text: "My lord, I think I saw him yesternight... The king your father.", chord: 'A7 (V of D)', analysis: 'Dominant preparation. The narrative drive is re-engaged.' }
            },
            {
                name: 'Hamlet Watch',
                description: '"The air bites shrewdly." Waiting for the ghost.',
                trauma: 0.4, entropy: 0.4, focusLayer: 0,
                script: { speaker: 'Hamlet', text: "The air bites shrewdly; it is very cold.", chord: 'Sul Ponticello', analysis: 'Icy timbre. The texture of the Real approaching.' }
            },
            {
                name: 'Ghost Re-enters',
                description: '"Angels and ministers of grace defend us!"',
                trauma: 0.8, entropy: 0.6, focusLayer: 0,
                script: { speaker: 'Hamlet', text: "Angels and ministers of grace defend us!", chord: 'Cluster fff', analysis: 'Total acoustic shock. The barrier between biological life and death dissolves.' }
            },
            {
                name: 'Ghost Beckons',
                description: 'The ghost waves Hamlet to a more removed ground.',
                trauma: 0.6, entropy: 0.8, focusLayer: 6,
                script: { speaker: 'Horatio', text: "It beckons you to go away with it.", chord: 'Glissando Up', analysis: 'Seduction of the Death Drive. Pulling the subject away from the Symbolic community.' }
            },
            {
                name: 'I am thy Father',
                description: 'The revelation of identity.',
                trauma: 0.7, entropy: 0.3, focusLayer: 5,
                script: { speaker: 'Ghost', text: "I am thy father's spirit.", chord: 'Low C Pedal', analysis: 'The Name-of-the-Father speaks from the Real. Absolute authority.' }
            },
            {
                name: 'Murder Most Foul',
                description: 'The crime revealed.',
                trauma: 0.9, entropy: 0.4, focusLayer: 5,
                script: { speaker: 'Ghost', text: "Murder most foul, as in the best it is.", chord: 'Tritone (F#-C)', analysis: 'The structural tear in the universe. Regicide.' }
            },
            {
                name: 'Remember Me',
                description: '"Adieu, adieu, adieu. Remember me." The command.',
                trauma: 0.6, entropy: 0.6, focusLayer: 6,
                script: { speaker: 'Ghost', text: "Adieu, adieu, adieu. Remember me.", chord: 'Fading Echo', analysis: 'The fading voice leaves a scar (Trauma) on the subject\'s memory.' }
            },
            {
                name: 'Swear',
                description: '"Swear by my sword." The Ghost cries from beneath the earth.',
                trauma: 0.5, entropy: 0.8, focusLayer: 1,
                script: { speaker: 'Ghost', text: "Swear.", chord: 'Sub-bass Rumble', analysis: 'The voice from the underground (Unconscious). The Law is rooted in the dead.' }
            },
            // ACT II - The Spy Game
            {
                name: 'Ophelia\'s Fear',
                description: 'She tells Polonius of Hamlet\'s strange visit.',
                trauma: 0.4, entropy: 0.6, focusLayer: 4,
                script: { speaker: 'Ophelia', text: "Lord Hamlet, with his doublet all unbraced...", chord: 'Gmin/Eb', analysis: 'Vulnerability. The degradation of the Imaginary self-image.' }
            },
            {
                name: 'Polonius Theory',
                description: '"This is the very ecstasy of love." Misdiagnosis.',
                trauma: 0.2, entropy: 0.3, focusLayer: 5,
                script: { speaker: 'Polonius', text: "This is the very ecstasy of love.", chord: 'C Major (Dull)', analysis: 'Banal Symbolic interpretation. Polonius represents the "idiocy of the signifier".' }
            },
            {
                name: 'Fishmonger',
                description: 'Hamlet mocks Polonius.',
                trauma: 0.3, entropy: 0.7, focusLayer: 4,
                script: { speaker: 'Hamlet', text: "You are a fishmonger.", chord: 'Staccato Winds', analysis: 'Wordplay as weapon. Disarticulating the Symbolic authority.' }
            },
            {
                name: 'Prison',
                description: '"Denmark\'s a prison." Hamlet to Rosencrantz & Guildenstern.',
                trauma: 0.5, entropy: 0.5, focusLayer: 6,
                script: { speaker: 'Hamlet', text: "Denmark's a prison.", chord: 'Closed Voicing', analysis: 'Claustrophobia. The boundaries of the world map onto the boundaries of the mind.' }
            },
            {
                name: 'Quintessence of Dust',
                description: '"What a piece of work is man... yet to me, what is this quintessence of dust?"',
                trauma: 0.6, entropy: 0.8, focusLayer: 3,
                script: { speaker: 'Hamlet', text: "And yet to me, what is this quintessence of dust?", chord: 'Descending Chromatic', analysis: 'Melancholia. The withdrawal of libido from the object-world.' }
            },
            {
                name: 'Players Arrive',
                description: '"We\'ll have a speech straight." Art as mirror.',
                trauma: 0.3, entropy: 0.4, focusLayer: 5,
                script: { speaker: 'Hamlet', text: "We'll have a speech straight.", chord: 'Fanfare (Muted)', analysis: 'The play-within-the-signifier. A simulation to catch the Real.' }
            },
            {
                name: 'Hecuba',
                description: '"What\'s Hecuba to him, or he to Hecuba?" Soliloquy 2.',
                trauma: 0.5, entropy: 0.6, focusLayer: 4,
                script: { speaker: 'Hamlet', text: "What's Hecuba to him, or he to Hecuba, that he should weep for her?", chord: 'Am -> F#dim', analysis: 'Comparison of authenticity. The actor\'s fake emotion feels more Real than Hamlet\'s true drive.' }
            },
            {
                name: 'The Trap Plan',
                description: '"The play\'s the thing."',
                trauma: 0.4, entropy: 0.3, focusLayer: 5,
                script: { speaker: 'Hamlet', text: "The play's the thing wherein I'll catch the conscience of the King.", chord: 'D Major (Firm)', analysis: 'Re-assertion of Symbolic control. Strategy over melancholy.' }
            },
            // ACT III - The Crisis
            {
                name: 'To Be or Not To Be',
                description: 'Act III Scene 1. Hamlet enters, unaware of Claudius and Polonius concealed behind the arras.',
                trauma: 0.7, entropy: 0.9, focusLayer: 6,
                stageDirection: '[HAMLET enters, book in hand, walking slowly. He pauses center stage, staring into middle distance. His manner is distracted, melancholic. Behind the arras, CLAUDIUS and POLONIUS observe in silence.]',
                actorNote: '[Speak slowly, with growing intensity. Each phrase should land with philosophical weight. The rhythm accelerates at "the whips and scorns of time" then retreats to contemplation.]',
                mood: 'melancholic',
                script: {
                    speaker: 'Hamlet',
                    text: "To be, or not to be: that is the question: Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles, and by opposing end them? To die: to sleep; no more; and by a sleep to say we end the heart-ache and the thousand natural shocks that flesh is heir to...",
                    chord: 'Minimalist Pulse',
                    analysis: 'Zero-degree existentialism. The subject oscillates between Being and Void. Extended monologue reveals the recursive loop of the death-drive.'
                }
            },
            {
                name: 'Nunnery Scene',
                description: '"Get thee to a nunnery." Rejection of Ophelia.',
                trauma: 0.8, entropy: 0.7, focusLayer: 4,
                script: { speaker: 'Hamlet', text: "Get thee to a nunnery: why wouldst thou be a breeder of sinners?", chord: 'Cluster Stabs', analysis: 'Misogynistic projection. Repelling the object of desire to avoid the Real of procreation.' }
            },
            {
                name: 'Kings Conscience',
                description: 'The Dumb Show begins.',
                trauma: 0.5, entropy: 0.5, focusLayer: 2,
                script: { speaker: 'Ophelia', text: "What means this, my lord?", chord: 'Oboe/Bassoon', analysis: 'The Uncanny (Unheimlich) mimicry of the crime.' }
            },
            {
                name: 'The Mousetrap',
                description: 'Lucianus pours the poison.',
                trauma: 0.7, entropy: 0.6, focusLayer: 5,
                script: { speaker: 'Hamlet', text: "He poisons him i' the garden for's estate.", chord: 'Tremolo Sul Pont', analysis: 'The Trap snaps shut. Narrative mirrors reality.' }
            },
            {
                name: 'The King Rises',
                description: '"Give me some light!" Panic.',
                trauma: 0.9, entropy: 0.8, focusLayer: 5,
                script: { speaker: 'Claudius', text: "Give me some light, away!", chord: 'Orchestral Crash', analysis: 'Symbolic rupture. The King\'s mask falls off.' }
            },
            {
                name: 'Prayer Scene',
                description: 'Claudius attempts to pray. Hamlet spares him.',
                trauma: 0.6, entropy: 0.5, focusLayer: 3,
                script: { speaker: 'Claudius', text: "My words fly up, my thoughts remain below.", chord: 'Hollow Fifth', analysis: 'Empty ritual. The Signifier without the Signified (Spirit).' }
            },
            {
                name: 'Closet Scene Begins',
                description: 'Hamlet confronts Gertrude.',
                trauma: 0.7, entropy: 0.6, focusLayer: 4,
                script: { speaker: 'Hamlet', text: "Mother, you have my father much offended.", chord: 'Agitated Strings', analysis: 'Oedipal confrontation. The Son assumes the Law.' }
            },
            {
                name: 'Rat in the Arras',
                description: 'Polonius killed.',
                trauma: 0.8, entropy: 0.7, focusLayer: 1,
                script: { speaker: 'Hamlet', text: "How now! a rat? Dead, for a ducat, dead!", chord: 'Short Stab', analysis: 'The blindly acting Drive. Death emerges by accident.' }
            },
            {
                name: 'Two Pictures',
                description: 'Comparing the brothers.',
                trauma: 0.6, entropy: 0.5, focusLayer: 5,
                script: { speaker: 'Hamlet', text: "Look here, upon this picture, and on this.", chord: 'Polytonal', analysis: 'The Ideal Ego (Father) vs The Obscene Father (Claudius).' }
            },
            {
                name: 'Ghost Intervenes',
                description: 'Ghost appears to Hamlet only.',
                trauma: 0.8, entropy: 0.6, focusLayer: 6,
                script: { speaker: 'Ghost', text: "Do not forget. This visitation is but to whet thy almost blunted purpose.", chord: 'Ethereal Pad', analysis: 'The Super-Ego reaffirms the debt.' }
            },
            // ACT IV - Dissolution
            {
                name: 'Body in Scene',
                description: 'Hamlet hides Polonius\' body.',
                trauma: 0.6, entropy: 0.8, focusLayer: 1,
                script: { speaker: 'Hamlet', text: "The body is with the king, but the king is not with the body.", chord: 'Dissonant Counterpoint', analysis: 'Language games breakdown. Separation of Office (Symbolic) and Man (Real).' }
            },
            {
                name: 'Exile to England',
                description: 'Hamlet sent away.',
                trauma: 0.5, entropy: 0.5, focusLayer: 5,
                script: { speaker: 'Claudius', text: "Do it, England.", chord: 'Low Brass', analysis: 'Bureaucratic death drive.' }
            },
            {
                name: 'Ophelia\'s Flowers',
                description: 'Madness takes her.',
                trauma: 0.8, entropy: 0.9, focusLayer: 4,
                script: { speaker: 'Ophelia', text: "There's rosemary, that's for remembrance.", chord: 'Broken Arpeggios', analysis: 'Fragmentation of the feminine subject. Meaning disperses into nature.' }
            },
            {
                name: 'Laertes Returns',
                description: '"I\'ll be revenged most thoroughly."',
                trauma: 0.7, entropy: 0.4, focusLayer: 5,
                script: { speaker: 'Laertes', text: "To hell, allegiance! Vows, to the blackest devil!", chord: 'Aggressive Rhythm', analysis: 'Unchecked vengeance. Laertes is the "Acting Subject" contrasted with Hamlet.' }
            },
            {
                name: 'Ophelia\'s Death',
                description: 'Gertrude reports the drowning.',
                trauma: 0.9, entropy: 0.3, focusLayer: 2,
                script: { speaker: 'Gertrude', text: "Till that her garments, heavy with their drink, pull'd the poor wretch... to muddy death.", chord: 'Watery Texture', analysis: 'Re-absorption into the Real (Water/Mother/Death).' }
            },
            // ACT V - The End
            {
                name: 'Gravediggers',
                description: 'Clowns joking about death.',
                trauma: 0.4, entropy: 0.6, focusLayer: 1,
                script: { speaker: 'Clown', text: "There is no ancient gentlemen but gardeners, ditchers, and grave-makers.", chord: 'Folk Tune (Distorted)', analysis: 'The Carnivalesque. Leveling of hierarchy by Death.' }
            },
            {
                name: 'Yorick',
                description: 'Hamlet holds the skull.',
                trauma: 0.7, entropy: 0.5, focusLayer: 3,
                script: { speaker: 'Hamlet', text: "Alas, poor Yorick! I knew him, Horatio.", chord: 'Empty Octaves', analysis: 'Confrontation with the Objet a (The leftover of the subject).' }
            },
            {
                name: 'Funeral Fight',
                description: 'Hamlet leaps into the grave.',
                trauma: 0.8, entropy: 0.8, focusLayer: 1,
                script: { speaker: 'Hamlet', text: "I loved Ophelia. Forty thousand brothers could not... make up my sum.", chord: 'Cluster Clash', analysis: 'Violent assertion of Desire over the corpse of the Object.' }
            },
            {
                name: 'Osric',
                description: 'The fop invites to the duel.',
                trauma: 0.3, entropy: 0.7, focusLayer: 5,
                script: { speaker: 'Hamlet', text: "The concernancy, sir? why do we wrap the gentleman in our more rawer breath?", chord: 'Harpsichord', analysis: 'Mockery of the Court. The Symbolic is now just a game.' }
            },
            {
                name: 'Fall of a Sparrow',
                description: '"The readiness is all."',
                trauma: 0.5, entropy: 0.2, focusLayer: 6,
                script: { speaker: 'Hamlet', text: "If it be now, 'tis not to come... the readiness is all.", chord: 'C Major (Pure)', analysis: 'Acceptance. Alignment with Fate (The Big Other).' }
            },
            {
                name: 'The Duel Begins',
                description: 'Swords crossed.',
                trauma: 0.6, entropy: 0.5, focusLayer: 1,
                script: { speaker: 'King', text: "Give him the cup.", chord: 'Timpani Roll', analysis: 'The Poison (Real) enters the Ritual (Symbolic).' }
            },
            {
                name: 'Queen Drinks',
                description: '"The queen carouses to thy fortune, Hamlet."',
                trauma: 0.8, entropy: 0.7, focusLayer: 5,
                script: { speaker: 'Gertrude', text: "No, no, the drink, the drink!", chord: 'Discordant Swell', analysis: 'The Mother consumes the poison meant for the Son.' }
            },
            {
                name: 'Both Hit',
                description: 'Laertes wounds Hamlet, then is wounded.',
                trauma: 0.9, entropy: 0.8, focusLayer: 1,
                script: { speaker: 'Laertes', text: "I am justly kill'd with mine own treachery.", chord: 'Sharp Stabs', analysis: 'The reflexive nature of aggression. Rebound of the drive.' }
            },
            {
                name: 'King Dies',
                description: 'Hamlet forces the drink on Claudius.',
                trauma: 0.9, entropy: 0.9, focusLayer: 0,
                script: { speaker: 'Hamlet', text: "Here, thou incestuous, murderous, damned Dane, drink off this potion!", chord: 'Tutti FF', analysis: 'Regicide completed. The Father-Substitute is destroyed.' }
            },
            {
                name: 'Hamlet Dies',
                description: '"The rest is silence."',
                trauma: 1.0, entropy: 1.0, focusLayer: -1,
                script: { speaker: 'Hamlet', text: "The rest is silence.", chord: 'Fade to Silence', analysis: 'Subjective destitution. The end of language.' }
            },
            {
                name: 'Fortinbras',
                description: 'The Norwegian armies arrive.',
                trauma: 0.2, entropy: 0.1, focusLayer: 5,
                script: { speaker: 'Fortinbras', text: "Go, bid the soldiers shoot.", chord: 'Military Drum', analysis: 'Re-establishment of the Symbolic Order by a new Master.' }
            }
        ]
    },
    {
        id: 'oedipus',
        title: 'Oedipus Rex',
        author: 'Sophocles',
        theme: 'Anagnorisis - The Terrible Truth',
        color: '#ef4444',
        frames: [
            {
                name: 'The Suppliants',
                description: 'The Priest begs Oedipus to save Thebes.',
                trauma: 0.2, entropy: 0.3, focusLayer: 5,
                script: { speaker: 'Priest', text: "Thebes is dying. A blight is on the fruitful plants of the earth.", chord: 'C Minor Pedal', analysis: 'Stasis. The sterility of the Land reflects the King\'s sin.' }
            },
            {
                name: 'Oedipus Promises',
                description: '"I know you are sick, but I am sicker than you all."',
                trauma: 0.3, entropy: 0.4, focusLayer: 4,
                script: { speaker: 'Oedipus', text: "My soul cries out for the city, for myself, for you.", chord: 'G Major (Heroic)', analysis: 'The Ego asserts control. Hubris (Inflation of the Imaginary).' }
            },
            {
                name: 'Creon Returns',
                description: 'News from Delphi.',
                trauma: 0.3, entropy: 0.5, focusLayer: 5,
                script: { speaker: 'Creon', text: "The God commands us to expel from the land of Thebes an old defilement.", chord: 'Ab Major', analysis: 'The Symbolic mandates cleansing. The Law arrives.' }
            },
            {
                name: 'The Promise',
                description: 'Oedipus vows to find the killer.',
                trauma: 0.4, entropy: 0.3, focusLayer: 5,
                script: { speaker: 'Oedipus', text: "I will bring it to light.", chord: 'C Major (Bright)', analysis: 'Irony. He seeks himself. The Eye looks for the I.' }
            },
            {
                name: 'Tiresias Called',
                description: 'The blind prophet arrives.',
                trauma: 0.4, entropy: 0.6, focusLayer: 6,
                script: { speaker: 'Chorus', text: "Here is the one who convicts the truth.", chord: 'Mystery Chord', analysis: 'Presence of Gnosis. The Real enters via the blind seer.' }
            },
            {
                name: 'Refusal to Speak',
                description: 'Tiresias stays silent.',
                trauma: 0.5, entropy: 0.6, focusLayer: 4,
                script: { speaker: 'Tiresias', text: "Alas, how terrible is wisdom when it brings no profit to the man that is wise!", chord: 'Bbm9', analysis: 'Withholding. The truth is too traumatic for the Symbolic to bear.' }
            },
            {
                name: 'Oedipus Rage',
                description: '"You are the killer!" Oedipus insults Tiresias.',
                trauma: 0.6, entropy: 0.7, focusLayer: 4,
                script: { speaker: 'Oedipus', text: "You scoundrel!", chord: 'Staccato Strings', analysis: 'Aggressive defense of the Ego. Projecting the shadow onto the Other.' }
            },
            {
                name: 'The Accusation',
                description: '"You are the cursed polluter of this land!"',
                trauma: 0.8, entropy: 0.5, focusLayer: 5,
                script: { speaker: 'Tiresias', text: "I say that you are the murderer whom you seek.", chord: 'F#dim7 Sforzando', analysis: 'The Truth acts as a blow (Trauma). The signifier "Murderer" attaches to the Subject.' }
            },
            {
                name: 'The Riddle',
                description: 'Tiresias hints at the parents.',
                trauma: 0.7, entropy: 0.8, focusLayer: 6,
                script: { speaker: 'Tiresias', text: "This day will give you a father, and break your heart.", chord: 'Atonal Drift', analysis: 'Collapsing time. Birth and destruction occupy the same moment.' }
            },
            {
                name: 'Creon Confronted',
                description: 'Oedipus accuses Creon of treason.',
                trauma: 0.5, entropy: 0.6, focusLayer: 5,
                script: { speaker: 'Oedipus', text: "You want my crown.", chord: 'G# Minor', analysis: 'Paranoia. The Subject constructs a conspiracy to avoid the Truth.' }
            },
            {
                name: 'Jocasta Intervenes',
                description: '"Do not quarrel." The Mother/Wife pacifies.',
                trauma: 0.4, entropy: 0.4, focusLayer: 4,
                script: { speaker: 'Jocasta', text: "Poor foolish men, what is this shouting?", chord: 'Eb Major (Warm)', analysis: 'The Maternal voice soothes. Temporary restoration of Imaginary wholeness.' }
            },
            {
                name: 'Jocasta\'s Proof',
                description: '"Prophecies are hollow. Laius was killed at three roads..."',
                trauma: 0.5, entropy: 0.3, focusLayer: 5,
                script: { speaker: 'Jocasta', text: "At a place where three roads meet...", chord: 'Eb6', analysis: 'The signifier "Three Roads" triggers the anamnesis (recollection).' }
            },
            {
                name: 'Oedipus Fear',
                description: '"I killed a man there..."',
                trauma: 0.6, entropy: 0.5, focusLayer: 3,
                script: { speaker: 'Oedipus', text: "O Zeus, what have you done with me?", chord: 'Tremolo Bass', analysis: 'Dread. The Subject begins to recognize himself as the object of the curse.' }
            },
            {
                name: 'Corinthian Messenger',
                description: 'Polybus is dead.',
                trauma: 0.4, entropy: 0.4, focusLayer: 5,
                script: { speaker: 'Messenger', text: "The King of Corinth is dead.", chord: 'Bb Major', analysis: 'False relief. "The Father is dead, I did not kill him." Misrecognition.' }
            },
            {
                name: 'Not Your Father',
                description: 'The messenger reveals the adoption.',
                trauma: 0.7, entropy: 0.5, focusLayer: 5,
                script: { speaker: 'Messenger', text: "Polybus was nothing to you in blood.", chord: 'G7sus4', analysis: 'Suspension of lineage. The Name-of-the-Father dissolves.' }
            },
            {
                name: 'Foundling',
                description: '"I found you in Cithaeron\'s glens."',
                trauma: 0.6, entropy: 0.6, focusLayer: 3,
                script: { speaker: 'Messenger', text: "Your ankles were pinned together.", chord: 'Pizzicato (Pain)', analysis: 'Physical mark of the Real (Swollen Foot). The body remembers.' }
            },
            {
                name: 'Jocasta Realizes',
                description: 'She knows the truth.',
                trauma: 0.9, entropy: 0.4, focusLayer: 4,
                script: { speaker: 'Jocasta', text: "God keep you from the knowledge of who you are!", chord: 'Dmin(maj7)', analysis: 'Horror. Structure collapses for the Mother first.' }
            },
            {
                name: 'Jocasta Flees',
                description: 'She runs into the palace.',
                trauma: 0.8, entropy: 0.5, focusLayer: 4,
                script: { speaker: 'Jocasta', text: "O miserable man! That is the only name I have for you.", chord: 'Rushing Scales', analysis: 'Abandonment. The Subject is left alone with the Real.' }
            },
            {
                name: 'Herdsman Arrives',
                description: 'The old shepherd is brought by force.',
                trauma: 0.6, entropy: 0.3, focusLayer: 5,
                script: { speaker: 'Oedipus', text: "Old man, look at me.", chord: 'Low Strings', analysis: 'Inquisition. The drive for Truth shifts to torture.' }
            },
            {
                name: 'Torture',
                description: '"Twist his hands!"',
                trauma: 0.8, entropy: 0.7, focusLayer: 1,
                script: { speaker: 'Oedipus', text: "If you won't speak, pain will make you.", chord: 'Dissonant Hits', analysis: 'Violence as the last resort of the investigating Subject.' }
            },
            {
                name: 'The Revelation',
                description: 'The Shepherd finally reveals that the child was Laius\'s own son, given to him to be exposed on Mount Cithaeron.',
                trauma: 0.95, entropy: 0.2, focusLayer: 0,
                stageDirection: '[The SHEPHERD, an old man, is held by attendants. He trembles. OEDIPUS stands close, his face contorted with desperate urgency. JOCASTA has fled inside. The CHORUS watches in frozen horror.]',
                actorNote: '[Shepherd: speak with reluctance dissolving into resignation. Oedipus: the voice should crack as comprehension dawns. This is the moment where the entire worldview collapses.]',
                mood: 'ominous',
                script: { speaker: 'Shepherd', text: "It was said to be his child... your wife could tell you best. She gave him to me... to kill. But I pitied it. And now, if you are what this man says, know that you were born for pain.", chord: 'C#m11', analysis: 'The Veil drops. Incest and Parricide confirmed. The Real crushes the Symbolic.' }
            },
            {
                name: 'ANAGNORISIS',
                description: 'Recognition. Oedipus screams as full understanding strikes.',
                trauma: 1.0, entropy: 0.1, focusLayer: -1,
                stageDirection: '[OEDIPUS staggers backward, hands rising to his face. A terrible sound escapes him - part scream, part groan. He turns wildly, as if seeking escape, then rushes toward the palace doors.]',
                actorNote: '[This must be the most devastating moment in tragic theatre. The cry "AIEEEE" should come from the gut. After the initial outburst, the next line is spoken with the clarity of absolute despair.]',
                mood: 'chaotic',
                script: { speaker: 'Oedipus', text: "O! O! O! All come to pass, all true! Light, may this be the last I look on you - I who was born of those who should not have borne me, married whom I should not marry, and slain those who should not have been slain!", chord: 'Orchestral Hit (Tutti)', analysis: 'Total Symbolic Collapse. The Ego (Eye) cannot sustain the vision of the Real.' }
            },
            {
                name: 'The Scream',
                description: 'Oedipus runs inside.',
                trauma: 1.0, entropy: 0.5, focusLayer: 4,
                script: { speaker: 'Chorus', text: "O generations of men...", chord: 'Choral Wail', analysis: 'Universal lament. The tragedy is ontological, not just personal.' }
            },
            {
                name: 'Jocasta Dead',
                description: 'News of the hanging.',
                trauma: 0.9, entropy: 0.6, focusLayer: 2,
                script: { speaker: 'Messenger', text: "The Queen is dead. By her own hand.", chord: 'Gmin/D', analysis: 'The Maternal Object is lost forever.' }
            },
            {
                name: 'The Blinding',
                description: 'Oedipus strikes his eyes.',
                trauma: 0.95, entropy: 0.8, focusLayer: 0,
                script: { speaker: 'Messenger', text: "He struck his eyes again and again.", chord: 'Piercing High Freq', analysis: 'Castration Anxiety realized. The Eye (I) is removed to pay the debt.' }
            },
            {
                name: 'Blind Entry',
                description: 'Oedipus returns, bleeding.',
                trauma: 0.8, entropy: 0.4, focusLayer: 0,
                script: { speaker: 'Chorus', text: "O dreadful sight!", chord: 'Low Drone', analysis: 'The Abject. He is now the "pollution" he sought.' }
            },
            {
                name: 'Meeting Creon',
                description: 'Creon is now King.',
                trauma: 0.6, entropy: 0.3, focusLayer: 5,
                script: { speaker: 'Creon', text: "I have not come to mock you, Oedipus.", chord: 'C Major (Solemn)', analysis: 'Restoration of Order. The Law persists despite the fall of the King.' }
            },
            {
                name: 'Daughters',
                description: 'Antigone and Ismene.',
                trauma: 0.7, entropy: 0.5, focusLayer: 4,
                script: { speaker: 'Oedipus', text: "Let me touch them... just touch them.", chord: 'Minor 2nd', analysis: 'Tenderness amidst ruin. The remaining emotional bonds.' }
            },
            {
                name: 'Exile',
                description: 'Driven out of Thebes.',
                trauma: 0.5, entropy: 0.4, focusLayer: 3,
                script: { speaker: 'Creon', text: "Go inside. Try not to be master in everything.", chord: 'Cadence (Incomplete)', analysis: 'Final lesson. The Subject must accept lack/castration.' }
            },
            {
                name: 'Final Chorus',
                description: '"Count no man happy till he dies."',
                trauma: 0.4, entropy: 0.2, focusLayer: -1,
                script: { speaker: 'Chorus', text: "Count no man happy till he dies, free of pain at last.", chord: 'C Minor -> Major', analysis: 'Catharsis. Integration of the Trauma into the cultural memory.' }
            }
        ]
    },
    {
        id: 'macbeth',
        title: 'Macbeth',
        author: 'Shakespeare',
        theme: 'Vaulting Ambition',
        color: '#22c55e',
        frames: [
            // ACT I
            {
                name: 'Weird Sisters',
                description: 'Three witches on the heath. Thunder.',
                trauma: 0.2, entropy: 0.3, focusLayer: 6,
                script: { speaker: 'Witches', text: "Fair is foul, and foul is fair.", chord: 'F#/C (Tritone)', analysis: 'Inversion of the Moral Law. Chaos is the baseline.' }
            },
            {
                name: 'Bloody Sergeant',
                description: 'Report of the battle.',
                trauma: 0.3, entropy: 0.5, focusLayer: 1,
                script: { speaker: 'Captain', text: "He unseam'd him from the nave to the chaps.", chord: 'Martial Drums', analysis: 'Violence as the currency of this world.' }
            },
            {
                name: 'Macbeth Arrives',
                description: '"So foul and fair a day I have not seen."',
                trauma: 0.2, entropy: 0.4, focusLayer: 4,
                script: { speaker: 'Macbeth', text: "So foul and fair a day I have not seen.", chord: 'Echoing Motif', analysis: 'He unknowingly repeats the Witches\' signifier. Infection.' }
            },
            {
                name: 'Prophecies',
                description: 'Hail King hereafter. Banquo to be father of kings.',
                trauma: 0.3, entropy: 0.6, focusLayer: 6,
                script: { speaker: 'Witches', text: "All hail, Macbeth, that shalt be king hereafter!", chord: 'Rising Brass', analysis: 'Interpellation. The subject is hailed by a destiny (The Real).' }
            },
            {
                name: 'Into Thin Air',
                description: 'Witches vanish.',
                trauma: 0.4, entropy: 0.7, focusLayer: 6,
                script: { speaker: 'Banquo', text: "The earth hath bubbles, as the water has.", chord: 'Glissando', analysis: 'Ontological instability. Reality is porous.' }
            },
            {
                name: 'Ross Arrives',
                description: 'Macbeth named Thane of Cawdor.',
                trauma: 0.3, entropy: 0.4, focusLayer: 5,
                script: { speaker: 'Ross', text: "He bade me, from him, call thee thane of Cawdor.", chord: 'Heavy Chord', analysis: 'Confirmation. The Supernatural bleeds into the Political.' }
            },
            {
                name: 'Dark Thoughts',
                description: '"If good, why do I yield to that suggestion?"',
                trauma: 0.5, entropy: 0.5, focusLayer: 3,
                script: { speaker: 'Macbeth', text: "My thought, whose murder yet is but fantastical...", chord: 'Low Chromatics', analysis: 'The Drive awakens. The image of murder forms in the Imaginary.' }
            },
            {
                name: 'Prince of Cumberland',
                description: 'Malcolm named heir. Obstacle.',
                trauma: 0.4, entropy: 0.5, focusLayer: 5,
                script: { speaker: 'Macbeth', text: "Stars, hide your fires; let not light see my black and deep desires.", chord: 'Muted Brass', analysis: 'Repression. The Subject splits between public loyalty and private treason.' }
            },
            {
                name: 'Lady Macbeth Reads',
                description: 'The letter.',
                trauma: 0.2, entropy: 0.3, focusLayer: 4,
                script: { speaker: 'Lady Macbeth', text: "Glamis thou art, and Cawdor; and shalt be what thou art promised.", chord: 'E Phrygian', analysis: 'The Will to Power. She becomes the agent of the Drive.' }
            },
            {
                name: 'Unsex Me Here',
                description: 'Invocation of spirits.',
                trauma: 0.6, entropy: 0.6, focusLayer: 4,
                script: { speaker: 'Lady Macbeth', text: "Unsex me here, and fill me from the crown to the toe top-full of direst cruelty.", chord: 'Cluster Swell', analysis: 'Rejection of the Symbolic Order (Gender/Motherhood) to become a pure instrument of Death.' }
            },
            {
                name: 'Duncan Arrives',
                description: '"This castle hath a pleasant seat."',
                trauma: 0.1, entropy: 0.2, focusLayer: 5,
                script: { speaker: 'Duncan', text: "This castle hath a pleasant seat.", chord: 'Pastoral F Major', analysis: 'Irony. The Victim praises the slaughterhouse.' }
            },
            {
                name: 'If It Were Done',
                description: 'Macbeth hesitates.',
                trauma: 0.5, entropy: 0.5, focusLayer: 3,
                script: { speaker: 'Macbeth', text: "I have no spur to prick the sides of my intent.", chord: 'Oscillating Bass', analysis: 'Ambivalence. The Law (Superego) fights the Id.' }
            },
            {
                name: 'Screw Your Courage',
                description: 'Lady Macbeth shames him.',
                trauma: 0.6, entropy: 0.4, focusLayer: 4,
                script: { speaker: 'Lady Macbeth', text: "When you durst do it, then playd'st you the man.", chord: 'Sharp Accents', analysis: 'Castration threat. She questions his Phallic potency to force the act.' }
            },
            // ACT II - The Deed
            {
                name: 'Dagger Vision',
                description: 'Hallucination.',
                trauma: 0.7, entropy: 0.7, focusLayer: 4,
                script: { speaker: 'Macbeth', text: "Is this a dagger which I see before me?", chord: 'Whole Tone Scale', analysis: 'Psychotic break. The Imaginary object becomes Real.' }
            },
            {
                name: 'The Bell',
                description: 'Signal to kill.',
                trauma: 0.8, entropy: 0.5, focusLayer: 5,
                script: { speaker: 'Macbeth', text: "Hear it not, Duncan; for it is a knell.", chord: 'Bell Toll', analysis: 'The threshold. Crossing from lawful subject to Criminal.' }
            },
            {
                name: 'The Murder',
                description: 'Act II Scene 2. Lady Macbeth waits as her husband commits regicide offstage.',
                trauma: 0.9, entropy: 0.6, focusLayer: 1,
                stageDirection: '[Night. A courtyard. LADY MACBETH enters with a torch. Distant owl hoots. Crickets. She is alert, tense, listening for sounds from Duncan\'s chamber above. She starts at every noise.]',
                actorNote: '[Lady Macbeth: whisper with fierce intensity. Her confidence is a mask over deep anxiety. When Macbeth enters, she must shift between impatience, fear, and steely resolve.]',
                mood: 'tense',
                script: { speaker: 'Lady Macbeth', text: "That which hath made them drunk hath made me bold; what hath quench'd them hath given me fire. Hark! Peace! It was the owl that shriek'd, the fatal bellman, which gives the stern'st good-night. He is about it: the doors are open; and the surfeited grooms do mock their charge with snores: I have drugg'd their possets. Had he not resembled my father as he slept, I had done't.", chord: 'Silence -> Thud', analysis: 'The Act (Passage a l\'acte). Irreversible rupture. Her confession about her father reveals the Oedipal limit even she cannot cross.' }
            },
            {
                name: 'Sleep No More',
                description: 'Macbeth returns, shattered, hands dripping blood.',
                trauma: 0.9, entropy: 0.8, focusLayer: 3,
                stageDirection: '[MACBETH enters from above, hands red with blood. He stares at them in horror. He carries the murder daggers - a fatal mistake. LADY MACBETH sees them and recoils.]',
                actorNote: '[Macbeth: he should seem almost in a trance, speaking as if the words force themselves out. His gaze is fixed not on Lady Macbeth but on something invisible. The trauma is immediate and total.]',
                mood: 'chaotic',
                script: { speaker: 'Macbeth', text: "I have done the deed. Didst thou not hear a noise? Methought I heard a voice cry 'Sleep no more! Macbeth does murder sleep' - the innocent sleep, sleep that knits up the ravell'd sleave of care, the death of each day's life, sore labour's bath, balm of hurt minds, great nature's second course, chief nourisher in life's feast.", chord: 'Dissonant Drone', analysis: 'Guilt destroys the unconscious refuge (Sleep). The voice is the Super-Ego announcing the permanent exile from peace.' }
            },
            {
                name: 'Knocking',
                description: 'The banging at the gate.',
                trauma: 0.8, entropy: 0.9, focusLayer: 0,
                script: { speaker: 'Gate', text: "*Knock, Knock, Knock*", chord: 'Percussive Strikes', analysis: 'Reality knocking. The outside world demands entry.' }
            },
            {
                name: 'Porter Scene',
                description: 'Hell gate.',
                trauma: 0.4, entropy: 0.7, focusLayer: 1,
                script: { speaker: 'Porter', text: "Who's there, in the name of Beelzebub?", chord: 'Grotesque Waltz', analysis: 'Comic relief as structural bridge. This IS Hell.' }
            },
            {
                name: 'Discovery',
                description: 'Macduff finds the body.',
                trauma: 0.95, entropy: 0.8, focusLayer: 5,
                script: { speaker: 'Macduff', text: "Horror, horror, horror!", chord: 'Shrill Scream', analysis: 'The Symbolic Order is shattered. The King (Center) is dead.' }
            },
            // ACT III - The Tyrant
            {
                name: 'Fears in Banquo',
                description: '"Thou play\'dst most foully for\'t."',
                trauma: 0.4, entropy: 0.5, focusLayer: 3,
                script: { speaker: 'Banquo', text: "I fear thou play'dst most foully for't.", chord: 'Suspicion Chord', analysis: 'The Gaze of the Other (Banquo) threatens the Ego.' }
            },
            {
                name: 'To Be Thus',
                description: '"To be thus is nothing; but to be safely thus."',
                trauma: 0.6, entropy: 0.4, focusLayer: 5,
                script: { speaker: 'Macbeth', text: "To be thus is nothing; but to be safely thus.", chord: 'Minor 2nd Interval', analysis: 'Anxiety. The usurped position is inherently unstable.' }
            },
            {
                name: 'Banquo Murder',
                description: 'Assassins strike.',
                trauma: 0.8, entropy: 0.7, focusLayer: 1,
                script: { speaker: 'Murderer', text: "There's but one down; the son is fled.", chord: 'Stab -> Gliss', analysis: 'Failure. The Real (Fleance implies future) escapes control.' }
            },
            {
                name: 'Banquet Ghost',
                description: 'Banquo sits in Macbeth\'s chair.',
                trauma: 0.9, entropy: 0.8, focusLayer: 4,
                script: { speaker: 'Macbeth', text: "Thou canst not say I did it: never shake thy gory locks at me.", chord: 'Polychord Clashing', analysis: 'Return of the Repressed. The Hallucination dismantles the Social Facade.' }
            },
            {
                name: 'Blood will have Blood',
                description: 'After the guests leave.',
                trauma: 0.7, entropy: 0.6, focusLayer: 3,
                script: { speaker: 'Macbeth', text: "It will have blood; they say, blood will have blood.", chord: 'Repeating Motif', analysis: 'Karmic cycle. The logic of the Drive requires repetition.' }
            },
            // ACT IV - The Unraveling
            {
                name: 'Hecate',
                description: 'The witches prepare.',
                trauma: 0.3, entropy: 0.7, focusLayer: 6,
                script: { speaker: 'Witches', text: "Double, double toil and trouble.", chord: 'Rhythmic Chant', analysis: 'Ritual invocation of Chaos.' }
            },
            {
                name: 'Apparitions',
                description: 'Armed Head, Bloody Child, Child Crowne.',
                trauma: 0.5, entropy: 0.8, focusLayer: 6,
                script: { speaker: 'Apparition', text: "Laugh to scorn the power of man...", chord: 'Illusory Major', analysis: 'Equivocation. Truth disguised as a lie to entrap the Subject.' }
            },
            {
                name: 'Line of Kings',
                description: 'Banquo\'s descendants.',
                trauma: 0.8, entropy: 0.5, focusLayer: 5,
                script: { speaker: 'Macbeth', text: "What, will the line stretch out to the crack of doom?", chord: 'Endless Canon', analysis: 'Infinity of the Other. Macbeth sees his own erasure.' }
            },
            {
                name: 'Macduff Family',
                description: 'Slaughter of wife and babes.',
                trauma: 1.0, entropy: 0.9, focusLayer: 1,
                script: { speaker: 'Son', text: "He has kill'd me, mother.", chord: 'Sudden Cut', analysis: 'Pure Atrocity. The lowest point of the moral universe.' }
            },
            {
                name: 'Macduff Grief',
                description: 'News in England.',
                trauma: 0.9, entropy: 0.4, focusLayer: 3,
                script: { speaker: 'Macduff', text: "All my pretty ones? Did you say all?", chord: 'Heartbreak Strings', analysis: 'Mourning. The conversion of Trauma into Resolve.' }
            },
            // ACT V - Death
            {
                name: 'Lady Macbeth Madness',
                description: 'Sleepwalking.',
                trauma: 0.8, entropy: 0.8, focusLayer: 4,
                script: { speaker: 'Lady Macbeth', text: "Out, damned spot! out, I say!", chord: 'Fragile Violin', analysis: 'Guilt loop. The Real stain cannot be washed by Symbolic water.' }
            },
            {
                name: 'Way to Dusty Death',
                description: 'Lady Macbeth dies.',
                trauma: 0.6, entropy: 0.9, focusLayer: 3,
                script: { speaker: 'Seyton', text: "The queen, my lord, is dead.", chord: 'Hollow Wind', analysis: 'Loss of the Partner in Crime.' }
            },
            {
                name: 'Signifying Nothing',
                description: 'The Soliloquy.',
                trauma: 1.0, entropy: 1.0, focusLayer: -1,
                script: { speaker: 'Macbeth', text: "Life's but a walking shadow... signifying nothing.", chord: 'Atonal Void', analysis: 'Nihilism. Total collapse of Meaning.' }
            },
            {
                name: 'Birnam Wood',
                description: 'The forest moves.',
                trauma: 0.7, entropy: 0.5, focusLayer: 2,
                script: { speaker: 'Messenger', text: "I look'd toward Birnam, and anon, methought, the wood began to move.", chord: 'Low Rumble', analysis: 'The Impossible becomes Real. Prophecy fulfills ironically.' }
            },
            {
                name: 'Bear-like',
                description: 'Macbeth trapped.',
                trauma: 0.8, entropy: 0.5, focusLayer: 1,
                script: { speaker: 'Macbeth', text: "They have tied me to a stake; I cannot fly.", chord: 'Trapped Rhythm', analysis: 'The cornered beast. Pure fight response.' }
            },
            {
                name: 'Macduff Confronts',
                description: '"Turn, hell-hound, turn!"',
                trauma: 0.9, entropy: 0.6, focusLayer: 1,
                script: { speaker: 'Macduff', text: "Turn, hell-hound, turn!", chord: 'Challenge Horn', analysis: 'The Avenger arrives.' }
            },
            {
                name: 'Untimely Ripped',
                description: 'The final loophole revealed.',
                trauma: 0.95, entropy: 0.4, focusLayer: 5,
                script: { speaker: 'Macduff', text: "Macduff was from his mother's womb untimely ripp'd.", chord: 'Shock Chord', analysis: 'The Caesura. He falls outside the "natural" order (Born of Woman).' }
            },
            {
                name: 'Lay On',
                description: 'Macbeth fights to die.',
                trauma: 0.9, entropy: 0.2, focusLayer: 1,
                script: { speaker: 'Macbeth', text: "Lay on, Macduff, and damn'd be him that first cries, 'Hold, enough!'", chord: 'Final Clash', analysis: 'Defiance. Embracing death as the only exit.' }
            },
            {
                name: 'Tyrant Dead',
                description: 'Head on a pole.',
                trauma: 0.5, entropy: 0.1, focusLayer: 5,
                script: { speaker: 'Macduff', text: "Hail, King! for so thou art.", chord: 'Victory Fanfare', analysis: 'Restoration. The Symbolic Order heals the wound.' }
            }
        ]
    }
];
