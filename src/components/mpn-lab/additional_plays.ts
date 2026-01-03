/**
 * Additional Literary Scenarios
 * 10 Complete Plays for Psychometric Analysis
 */

import { LiteraryScenario } from './types';

export const ADDITIONAL_SCENARIOS: LiteraryScenario[] = [
    // MEDEA - Euripides
    {
        id: 'medea',
        title: 'Medea',
        author: 'Euripides',
        theme: 'Revenge and Betrayal',
        color: '#dc2626',
        frames: [
            { name: 'Nurse Lament', description: 'If only the Argo had never sailed...', trauma: 0.4, entropy: 0.3, focusLayer: 0, script: { speaker: 'Nurse', text: "Would that the Argo had never winged its way to Colchis.", chord: 'Dmaj7', analysis: 'Retrospective wish. The origin of all tragedy.' } },
            { name: 'Medea Wails', description: 'Offstage cries of anguish.', trauma: 0.8, entropy: 0.7, focusLayer: 3, script: { speaker: 'Medea', text: "Oh, I am wretched! Unhappy that I am!", chord: 'C#dim7', analysis: 'Raw Trauma. The voice from the chamber.' } },
            { name: 'Jason Arrives', description: 'The betrayer comes with reasons.', trauma: 0.6, entropy: 0.5, focusLayer: 4, script: { speaker: 'Jason', text: "I have often noticed that a hot temper achieves nothing.", chord: 'Bb Major', analysis: 'False rationality masking betrayal.' } },
            { name: 'Medea Confronts', description: 'The accusation.', trauma: 0.9, entropy: 0.6, focusLayer: 1, script: { speaker: 'Medea', text: "O vile wretch, for that is the name you deserve!", chord: 'F# Minor', analysis: 'The signifier of moral condemnation.' } },
            { name: 'Aegeus Promise', description: 'Refuge offered.', trauma: 0.3, entropy: 0.4, focusLayer: 5, script: { speaker: 'Aegeus', text: "You shall have refuge safe from harm with me.", chord: 'G Major', analysis: 'The escape route established.' } },
            { name: 'The Plan', description: 'Medea plots.', trauma: 0.7, entropy: 0.8, focusLayer: 6, script: { speaker: 'Medea', text: "I shall send gifts to the bride, a fine robe and a golden diadem.", chord: 'Tritone', analysis: 'The death-objects are announced.' } },
            { name: 'Children Sent', description: 'Innocent messengers of death.', trauma: 0.85, entropy: 0.5, focusLayer: 2, script: { speaker: 'Children', text: "Mother, we did as you asked.", chord: 'Amin', analysis: 'Tragic irony. The children deliver their own doom.' } },
            { name: 'Bride Dies', description: 'Messenger reports the horror.', trauma: 1.0, entropy: 0.4, focusLayer: 1, script: { speaker: 'Messenger', text: "The golden crown burst forth a torrent of consuming fire!", chord: 'Cluster fff', analysis: 'The Real of death by fire.' } },
            { name: 'Medea Decides', description: 'The ultimate horror.', trauma: 1.0, entropy: 0.9, focusLayer: -1, script: { speaker: 'Medea', text: "I must kill my children. There is no other way.", chord: 'Silence', analysis: 'Beyond ethics. The threshold of the monstrous.' } },
            { name: 'Children Cry', description: 'Death offstage.', trauma: 1.0, entropy: 0.2, focusLayer: 0, script: { speaker: 'Children', text: "No, mother! Do not kill us!", chord: 'Scream', analysis: 'The unbearable Real of infanticide.' } },
            { name: 'Jason Returns', description: 'Discovery of horror.', trauma: 0.9, entropy: 0.6, focusLayer: 3, script: { speaker: 'Jason', text: "Open the doors! I would see the children!", chord: 'Desperate Knocking', analysis: 'The locked door as barrier to truth.' } },
            { name: 'Medea Triumphant', description: 'Dragon chariot escape.', trauma: 0.5, entropy: 0.3, focusLayer: 5, script: { speaker: 'Medea', text: "I go to bury these children with my own hands.", chord: 'Ascending Scale', analysis: 'Escape from justice into myth.' } }
        ]
    },

    // ANTIGONE - Sophocles
    {
        id: 'antigone',
        title: 'Antigone',
        author: 'Sophocles',
        theme: 'Divine Law vs Human Law',
        color: '#7c3aed',
        frames: [
            { name: 'Sisters Debate', description: 'Antigone tells Ismene of her plan.', trauma: 0.4, entropy: 0.5, focusLayer: 4, script: { speaker: 'Antigone', text: "Will you help me lift the body?", chord: 'Dmin', analysis: 'The call to transgression.' } },
            { name: 'Ismene Refuses', description: 'Fear of Creon.', trauma: 0.3, entropy: 0.4, focusLayer: 4, script: { speaker: 'Ismene', text: "We must remember we are women, not meant to fight with men.", chord: 'A Minor', analysis: 'The compliant subject of the Symbolic.' } },
            { name: 'Creon Decree', description: 'The law is stated.', trauma: 0.2, entropy: 0.2, focusLayer: 5, script: { speaker: 'Creon', text: "Polynices shall lie unburied, a feast for birds and dogs.", chord: 'C Major (Cold)', analysis: 'The tyrannical signifier.' } },
            { name: 'Burial Discovered', description: 'Someone has defied the edict.', trauma: 0.6, entropy: 0.7, focusLayer: 2, script: { speaker: 'Guard', text: "Someone has buried the corpse, dust sprinkled over it.", chord: 'Mystery Strings', analysis: 'The act of resistance.' } },
            { name: 'Antigone Caught', description: 'Second burial, witnessed.', trauma: 0.7, entropy: 0.5, focusLayer: 1, script: { speaker: 'Guard', text: "We caught this girl burying him in broad daylight.", chord: 'Exposed', analysis: 'The return of the repressed act.' } },
            { name: 'Antigone Defiant', description: 'The famous speech.', trauma: 0.5, entropy: 0.3, focusLayer: 0, script: { speaker: 'Antigone', text: "I did not think your edicts strong enough to overrule the unwritten laws of heaven.", chord: 'Modal Shift', analysis: 'Divine Law vs State Law.' } },
            { name: 'Creon Enraged', description: 'Sentencing.', trauma: 0.7, entropy: 0.4, focusLayer: 5, script: { speaker: 'Creon', text: "Take her and wall her up in a tomb alive!", chord: 'Doom Chord', analysis: 'Living burial as punishment.' } },
            { name: 'Haemon Pleads', description: 'Son begs father.', trauma: 0.6, entropy: 0.6, focusLayer: 4, script: { speaker: 'Haemon', text: "Father, the gods plant reason in men.", chord: 'Bb Major', analysis: 'Filial appeal to wisdom.' } },
            { name: 'Tiresias Warning', description: 'The prophet speaks.', trauma: 0.8, entropy: 0.5, focusLayer: 6, script: { speaker: 'Tiresias', text: "All men make mistakes. But wise men yield.", chord: 'Prophetic Horn', analysis: 'The voice of the gods.' } },
            { name: 'Creon Yields', description: 'Too late.', trauma: 0.7, entropy: 0.8, focusLayer: 3, script: { speaker: 'Creon', text: "I will go and free her from the vault.", chord: 'Hurrying Tempo', analysis: 'The belated reversal.' } },
            { name: 'Triple Death', description: 'All lost.', trauma: 1.0, entropy: 0.4, focusLayer: -1, script: { speaker: 'Messenger', text: "Antigone hanged herself. Haemon stabbed himself. Eurydice is dead.", chord: 'Three Chords', analysis: 'Catastrophe upon catastrophe.' } },
            { name: 'Creon Broken', description: 'The tyrant destroyed.', trauma: 0.9, entropy: 0.2, focusLayer: 3, script: { speaker: 'Creon', text: "Lead me away, a rash, useless man.", chord: 'Collapse', analysis: 'The fall of the rigid Symbolic.' } }
        ]
    },

    // OTHELLO - Shakespeare
    {
        id: 'othello',
        title: 'Othello',
        author: 'Shakespeare',
        theme: 'Jealousy and Manipulation',
        color: '#059669',
        frames: [
            { name: "Iago's Resentment", description: 'Opening complaint.', trauma: 0.3, entropy: 0.6, focusLayer: 6, script: { speaker: 'Iago', text: "I follow him to serve my turn upon him.", chord: 'E Minor', analysis: 'The servant who hates his master.' } },
            { name: 'Othello/Desdemona', description: 'Love before the Senate.', trauma: 0.1, entropy: 0.3, focusLayer: 0, script: { speaker: 'Othello', text: "She loved me for the dangers I had passed, and I loved her that she did pity them.", chord: 'D Major', analysis: 'The origin of love in narrative.' } },
            { name: 'Honest Iago', description: 'Trust established.', trauma: 0.2, entropy: 0.4, focusLayer: 5, script: { speaker: 'Othello', text: "A man he is of honest and trust.", chord: 'F Major', analysis: 'Fatal misjudgment.' } },
            { name: 'Cassio Cashiered', description: 'The brawl, dismissal.', trauma: 0.5, entropy: 0.7, focusLayer: 2, script: { speaker: 'Othello', text: "Cassio, I love thee; but never more be officer of mine.", chord: 'Harsh Break', analysis: 'The first domino falls.' } },
            { name: 'Iago Plants Seed', description: 'Ha! I like not that.', trauma: 0.6, entropy: 0.6, focusLayer: 6, script: { speaker: 'Iago', text: "Ha! I like not that.", chord: 'Serpentine', analysis: 'The minimal signifier of suspicion.' } },
            { name: 'Handkerchief', description: 'The fatal token.', trauma: 0.5, entropy: 0.5, focusLayer: 4, script: { speaker: 'Othello', text: "That handkerchief did an Egyptian to my mother give.", chord: 'Exotic Mode', analysis: 'The object invested with meaning.' } },
            { name: 'Green-Eyed Monster', description: 'Jealousy rises.', trauma: 0.8, entropy: 0.6, focusLayer: 3, script: { speaker: 'Iago', text: "O, beware, my lord, of jealousy! It is the green-eyed monster.", chord: 'Chromatic', analysis: 'Naming the demon to invoke it.' } },
            { name: 'Ocular Proof', description: 'Othello demands evidence.', trauma: 0.7, entropy: 0.5, focusLayer: 1, script: { speaker: 'Othello', text: "I'll have some proof! Give me the ocular proof!", chord: 'Demand', analysis: 'The impossible demand for certainty.' } },
            { name: "Iago's Lie", description: "Cassio's dream.", trauma: 0.9, entropy: 0.4, focusLayer: 6, script: { speaker: 'Iago', text: "In his sleep I heard him say: Sweet Desdemona, let us be wary.", chord: 'False Witness', analysis: 'Pure fabrication as evidence.' } },
            { name: 'Kill Her', description: 'Murder planned.', trauma: 0.95, entropy: 0.3, focusLayer: 1, script: { speaker: 'Othello', text: "I will chop her into messes!", chord: 'Violence', analysis: 'Jealousy becomes homicidal.' } },
            { name: 'Willow Song', description: 'Desdemona senses doom.', trauma: 0.6, entropy: 0.7, focusLayer: 4, script: { speaker: 'Desdemona', text: "Sing willow, willow, willow...", chord: 'Folk Lament', analysis: 'The song of approaching death.' } },
            { name: 'Put Out the Light', description: 'Before the murder.', trauma: 0.9, entropy: 0.3, focusLayer: 0, script: { speaker: 'Othello', text: "Put out the light, and then put out the light.", chord: 'Candle Music', analysis: 'The extinguishing of life.' } },
            { name: 'Desdemona Dies', description: 'Smothered.', trauma: 1.0, entropy: 0.2, focusLayer: -1, script: { speaker: 'Desdemona', text: "Commend me to my kind lord. O, farewell!", chord: 'Final Breath', analysis: 'Innocent death.' } },
            { name: 'Emilia Reveals', description: 'The truth explodes.', trauma: 0.85, entropy: 0.9, focusLayer: 4, script: { speaker: 'Emilia', text: "My husband? My husband told you she was false!", chord: 'Revelation', analysis: 'The unraveling of the plot.' } },
            { name: "Othello's End", description: 'Self-execution.', trauma: 0.9, entropy: 0.3, focusLayer: 3, script: { speaker: 'Othello', text: "I kissed thee ere I killed thee. No way but this, killing myself, to die upon a kiss.", chord: 'Liebestod', analysis: 'Love and death unified.' } }
        ]
    },

    // KING LEAR - Shakespeare
    {
        id: 'king_lear',
        title: 'King Lear',
        author: 'Shakespeare',
        theme: 'Madness and Filial Betrayal',
        color: '#6b7280',
        frames: [
            { name: 'Love Test', description: 'Lear divides the kingdom.', trauma: 0.2, entropy: 0.3, focusLayer: 5, script: { speaker: 'Lear', text: "Which of you shall we say doth love us most?", chord: 'Royal Fanfare', analysis: 'The impossible demand for quantified love.' } },
            { name: 'Cordelia Silent', description: 'Nothing.', trauma: 0.5, entropy: 0.4, focusLayer: 4, script: { speaker: 'Cordelia', text: "Nothing, my lord.", chord: 'Silence', analysis: 'The honest answer that offends.' } },
            { name: 'Banishment', description: 'Kent and Cordelia exiled.', trauma: 0.6, entropy: 0.5, focusLayer: 1, script: { speaker: 'Lear', text: "Out of my sight!", chord: 'Harsh Command', analysis: 'The father rejects truth-tellers.' } },
            { name: "Edmund's Plot", description: 'The bastard schemes.', trauma: 0.4, entropy: 0.7, focusLayer: 6, script: { speaker: 'Edmund', text: "Thou, Nature, art my goddess.", chord: 'Villain Theme', analysis: 'Natural law invoked for evil.' } },
            { name: 'Daughters Turn', description: "Goneril and Regan reduce Lear's train.", trauma: 0.7, entropy: 0.6, focusLayer: 3, script: { speaker: 'Goneril', text: "What need you five and twenty, ten, or five?", chord: 'Reduction', analysis: 'Stripping the king of symbols.' } },
            { name: 'Storm', description: 'Lear on the heath.', trauma: 0.9, entropy: 0.9, focusLayer: 0, script: { speaker: 'Lear', text: "Blow, winds, and crack your cheeks! rage! blow!", chord: 'Storm Cluster', analysis: 'The outer storm mirrors inner chaos.' } },
            { name: 'Poor Tom', description: 'Edgar as madman.', trauma: 0.8, entropy: 0.8, focusLayer: 2, script: { speaker: 'Edgar', text: "Poor Tom's a-cold.", chord: 'Shivering Strings', analysis: 'Feigned madness meeting real madness.' } },
            { name: 'Gloucester Blinded', description: 'Out, vile jelly.', trauma: 1.0, entropy: 0.5, focusLayer: 1, script: { speaker: 'Cornwall', text: "Out, vile jelly! Where is thy lustre now?", chord: 'Horror Chord', analysis: 'Physical mutilation as spectacle.' } },
            { name: 'Dover Cliff', description: 'Edgar guides blind Gloucester.', trauma: 0.6, entropy: 0.6, focusLayer: 4, script: { speaker: 'Edgar', text: "Come on, sir, here's the place. Stand still.", chord: 'Suspense', analysis: 'The imaginary cliff as therapy.' } },
            { name: 'Lear/Gloucester Meet', description: 'Two broken men.', trauma: 0.8, entropy: 0.7, focusLayer: 3, script: { speaker: 'Lear', text: "I know thee well enough; thy name is Gloucester.", chord: 'Recognition', analysis: 'Recognition in blindness and madness.' } },
            { name: 'Cordelia Returns', description: 'Reconciliation.', trauma: 0.4, entropy: 0.4, focusLayer: 4, script: { speaker: 'Cordelia', text: "O my dear father! Restoration hang thy medicine on my lips.", chord: 'Healing Theme', analysis: 'Daughter as savior.' } },
            { name: 'Battle Lost', description: 'Edmund victorious.', trauma: 0.7, entropy: 0.5, focusLayer: 2, script: { speaker: 'Edmund', text: "Take them away.", chord: 'Capture', analysis: 'The forces of betrayal win.' } },
            { name: 'Howl Howl Howl', description: 'Cordelia dead.', trauma: 1.0, entropy: 0.3, focusLayer: -1, script: { speaker: 'Lear', text: "Howl, howl, howl, howl! O, you are men of stones!", chord: 'Primal Scream', analysis: 'The ultimate loss.' } }
        ]
    },

    // A DOLL'S HOUSE - Ibsen
    {
        id: 'dolls_house',
        title: "A Doll's House",
        author: 'Henrik Ibsen',
        theme: 'Identity and Liberation',
        color: '#ec4899',
        frames: [
            { name: 'Christmas Eve', description: 'Nora brings gifts.', trauma: 0.1, entropy: 0.2, focusLayer: 0, script: { speaker: 'Nora', text: "Hide the Christmas tree well, Helene. The children mustn't see it before tonight.", chord: 'Major Waltz', analysis: 'Surface domesticity.' } },
            { name: 'Skylark', description: "Torvald's pet names.", trauma: 0.2, entropy: 0.3, focusLayer: 4, script: { speaker: 'Torvald', text: "Is that my little skylark twittering out there?", chord: 'Patronizing', analysis: 'The diminishing signifier.' } },
            { name: 'The Secret', description: "Nora's loan revealed to audience.", trauma: 0.5, entropy: 0.5, focusLayer: 3, script: { speaker: 'Nora', text: "I borrowed the money secretly.", chord: 'Minor Key', analysis: 'The hidden transgression.' } },
            { name: 'Krogstad Threatens', description: 'Blackmail begins.', trauma: 0.7, entropy: 0.6, focusLayer: 6, script: { speaker: 'Krogstad', text: "I have your bond in my safe at home.", chord: 'Threat', analysis: 'The document as weapon.' } },
            { name: 'Tarantella', description: 'Desperate dance.', trauma: 0.6, entropy: 0.8, focusLayer: 2, script: { speaker: 'Nora', text: "Faster! Faster!", chord: 'Frantic Dance', analysis: 'Physical symptom of internal chaos.' } },
            { name: 'Letter Arrives', description: 'The revelation threatens.', trauma: 0.8, entropy: 0.5, focusLayer: 1, script: { speaker: 'Nora', text: "That letter is from Krogstad.", chord: 'Suspense', analysis: 'The letter as ticking bomb.' } },
            { name: 'Torvald Reads', description: 'The explosion.', trauma: 0.9, entropy: 0.7, focusLayer: 5, script: { speaker: 'Torvald', text: "You have ruined my entire happiness. You have destroyed my whole future.", chord: 'Accusation', analysis: 'The mask drops.' } },
            { name: 'Second Letter', description: 'Krogstad forgives.', trauma: 0.4, entropy: 0.6, focusLayer: 4, script: { speaker: 'Torvald', text: "I am saved! Nora, I am saved!", chord: 'False Relief', analysis: 'His concern is only for himself.' } },
            { name: 'Nora Changes', description: 'She removes costume.', trauma: 0.3, entropy: 0.4, focusLayer: 3, script: { speaker: 'Nora', text: "I am changing my dress. No more masquerading.", chord: 'Transition', analysis: 'Symbolic disrobing.' } },
            { name: 'The Talk', description: 'Final confrontation.', trauma: 0.6, entropy: 0.5, focusLayer: 0, script: { speaker: 'Nora', text: "I have been performing tricks for you, Torvald.", chord: 'Clarification', analysis: 'The truth emerges.' } },
            { name: 'Strangers', description: 'Eight years as strangers.', trauma: 0.7, entropy: 0.4, focusLayer: 4, script: { speaker: 'Nora', text: "We have been strangers to each other for eight years.", chord: 'Distance', analysis: 'The negation of marriage.' } },
            { name: 'Door Slam', description: 'Nora leaves.', trauma: 0.5, entropy: 0.3, focusLayer: -1, script: { speaker: 'Nora', text: "I am going to try to learn to be a human being.", chord: 'Door Slam', analysis: 'The famous exit. Autonomy claimed.' } }
        ]
    },

    // HEDDA GABLER - Ibsen
    {
        id: 'hedda_gabler',
        title: 'Hedda Gabler',
        author: 'Henrik Ibsen',
        theme: 'Boredom and Destruction',
        color: '#8b5cf6',
        frames: [
            { name: 'Morning After Honeymoon', description: 'Hedda awakes bored.', trauma: 0.2, entropy: 0.4, focusLayer: 0, script: { speaker: 'Hedda', text: "Oh, that everlasting honeymoon.", chord: 'Ennui', analysis: 'Boredom as baseline state.' } },
            { name: 'Pistols', description: "General Gabler's guns.", trauma: 0.4, entropy: 0.3, focusLayer: 6, script: { speaker: 'Hedda', text: "I have my father's pistols to amuse myself with.", chord: 'Dark Joke', analysis: 'Death instruments as entertainment.' } },
            { name: 'Lovborg Returns', description: 'Former lover appears.', trauma: 0.5, entropy: 0.6, focusLayer: 4, script: { speaker: 'Lovborg', text: "I have come to take Thea home with me.", chord: 'Tension', analysis: 'The triangle forms.' } },
            { name: 'Vine Leaves', description: "Hedda's fantasy.", trauma: 0.3, entropy: 0.5, focusLayer: 3, script: { speaker: 'Hedda', text: "I want to picture him with vine leaves in his hair.", chord: 'Romantic Fantasy', analysis: 'Dionysian projection.' } },
            { name: 'Manuscript Revealed', description: "Lovborg's great work.", trauma: 0.4, entropy: 0.4, focusLayer: 5, script: { speaker: 'Tesman', text: "It is about the future of civilization.", chord: 'Hope', analysis: 'The creative work as life project.' } },
            { name: 'Burned', description: 'Hedda destroys manuscript.', trauma: 0.9, entropy: 0.6, focusLayer: 1, script: { speaker: 'Hedda', text: "Now I am burning your child, Thea.", chord: 'Fire', analysis: 'Symbolic infanticide.' } },
            { name: 'Pistol Given', description: 'Hedda arms Lovborg.', trauma: 0.8, entropy: 0.7, focusLayer: 6, script: { speaker: 'Hedda', text: "Do it beautifully.", chord: 'Death Command', analysis: "Orchestrating another's death." } },
            { name: 'Lovborg Dies', description: 'Not beautifully.', trauma: 0.9, entropy: 0.8, focusLayer: 2, script: { speaker: 'Brack', text: "Shot himself. In the stomach.", chord: 'Bungled Death', analysis: 'Reality denies romantic fantasy.' } },
            { name: "Brack's Power", description: 'Blackmail established.', trauma: 0.7, entropy: 0.5, focusLayer: 5, script: { speaker: 'Brack', text: "I am the only one who knows about the pistol.", chord: 'Trap Closing', analysis: 'The vice tightens.' } },
            { name: "Hedda's End", description: 'The shot.', trauma: 1.0, entropy: 0.2, focusLayer: -1, script: { speaker: 'Brack', text: "Good God! People don't do such things!", chord: 'Gunshot', analysis: 'The only free act remaining.' } }
        ]
    },

    // THE SEAGULL - Chekhov
    {
        id: 'seagull',
        title: 'The Seagull',
        author: 'Anton Chekhov',
        theme: 'Unrequited Love and Art',
        color: '#06b6d4',
        frames: [
            { name: "Konstantin's Play", description: 'Avant-garde theater fails.', trauma: 0.5, entropy: 0.6, focusLayer: 3, script: { speaker: 'Konstantin', text: "We need new forms. New forms are needed.", chord: 'Experimental', analysis: "The artist's manifesto." } },
            { name: 'Arkadina Mocks', description: 'Mother ridicules son.', trauma: 0.6, entropy: 0.5, focusLayer: 4, script: { speaker: 'Arkadina', text: "It seems to want to teach us something.", chord: 'Dismissal', analysis: 'Maternal cruelty.' } },
            { name: 'Nina Inspired', description: 'Young actress dreams.', trauma: 0.3, entropy: 0.5, focusLayer: 0, script: { speaker: 'Nina', text: "I shall be a great actress. I shall!", chord: 'Hope Theme', analysis: 'The naive aspiration.' } },
            { name: "Trigorin's Method", description: 'The successful writer.', trauma: 0.4, entropy: 0.4, focusLayer: 5, script: { speaker: 'Trigorin', text: "I am obsessed day and night by one thought: I must write, I must write.", chord: 'Compulsion', analysis: 'Art as neurosis.' } },
            { name: 'Dead Bird', description: 'Konstantin kills seagull.', trauma: 0.6, entropy: 0.6, focusLayer: 2, script: { speaker: 'Konstantin', text: "I was so mean as to kill this seagull.", chord: 'Symbol', analysis: 'The destructive act as confession.' } },
            { name: "Trigorin's Note", description: 'Story idea.', trauma: 0.5, entropy: 0.5, focusLayer: 6, script: { speaker: 'Trigorin', text: "Subject for a short story: A young girl... ruined like a seagull.", chord: 'Foreshadowing', analysis: "Nina's fate written." } },
            { name: 'Nina/Trigorin', description: 'She offers herself.', trauma: 0.6, entropy: 0.7, focusLayer: 4, script: { speaker: 'Nina', text: "I have decided. I am going on the stage.", chord: 'Decision', analysis: 'The fateful choice.' } },
            { name: 'Two Years Later', description: 'Everything has changed.', trauma: 0.7, entropy: 0.6, focusLayer: 0, script: { speaker: 'Masha', text: "I'm going to tear this love of mine out by the roots.", chord: 'Time Shift', analysis: 'The passage of time as damage.' } },
            { name: 'Nina Returns', description: 'Destroyed but enduring.', trauma: 0.8, entropy: 0.5, focusLayer: 3, script: { speaker: 'Nina', text: "I am the seagull. No, that's not it. I am an actress.", chord: 'Confusion', analysis: 'Identity crisis.' } },
            { name: "Konstantin's End", description: 'The shot offstage.', trauma: 1.0, entropy: 0.3, focusLayer: -1, script: { speaker: 'Dorn', text: "I think that bottle of ether must have exploded.", chord: 'Gunshot (Hidden)', analysis: 'Suicide concealed as accident.' } }
        ]
    },

    // UNCLE VANYA - Chekhov
    {
        id: 'uncle_vanya',
        title: 'Uncle Vanya',
        author: 'Anton Chekhov',
        theme: 'Wasted Life and Regret',
        color: '#84cc16',
        frames: [
            { name: 'The Professor Arrives', description: 'Serebryakov disrupts routine.', trauma: 0.3, entropy: 0.4, focusLayer: 5, script: { speaker: 'Vanya', text: "Everything has changed since he came.", chord: 'Disruption', analysis: 'The useless authority figure.' } },
            { name: "Astrov's Forests", description: 'Environmental lament.', trauma: 0.4, entropy: 0.5, focusLayer: 3, script: { speaker: 'Astrov', text: "The forests are being destroyed. The beautiful landscapes are gone forever.", chord: 'Elegy', analysis: 'Ecological mourning.' } },
            { name: "Elena's Boredom", description: 'The beautiful wife.', trauma: 0.3, entropy: 0.6, focusLayer: 4, script: { speaker: 'Elena', text: "I am dying of boredom. I don't know what to do.", chord: 'Languid', analysis: 'Beauty without purpose.' } },
            { name: "Vanya's Love", description: 'Hopeless confession.', trauma: 0.6, entropy: 0.5, focusLayer: 2, script: { speaker: 'Vanya', text: "I love you. This feeling is my only happiness.", chord: 'Unrequited', analysis: 'Love that cannot be returned.' } },
            { name: "Sonya's Love", description: 'Also hopeless.', trauma: 0.5, entropy: 0.4, focusLayer: 4, script: { speaker: 'Sonya', text: "He doesn't notice me. He doesn't see me.", chord: 'Invisibility', analysis: 'The unlovable one loves.' } },
            { name: 'Property Sale', description: "The professor's plan.", trauma: 0.8, entropy: 0.7, focusLayer: 5, script: { speaker: 'Serebryakov', text: "I propose to sell the estate.", chord: 'Outrage', analysis: 'The final injustice.' } },
            { name: 'Vanya Shoots', description: 'And misses.', trauma: 0.9, entropy: 0.9, focusLayer: 1, script: { speaker: 'Vanya', text: "Bang! Missed! Missed again!", chord: 'Chaos', analysis: 'Even violence fails.' } },
            { name: 'Astrov Leaves', description: 'Taking morphine.', trauma: 0.5, entropy: 0.4, focusLayer: 3, script: { speaker: 'Astrov', text: "If you ever need me, you know where to find me.", chord: 'Departure', analysis: 'The only free agent exits.' } },
            { name: 'We Must Work', description: "Sonya's final speech.", trauma: 0.6, entropy: 0.3, focusLayer: 0, script: { speaker: 'Sonya', text: "We shall rest. We shall hear the angels. We shall see the heavens.", chord: 'Consolation', analysis: 'Hope deferred to afterlife.' } }
        ]
    },

    // MISS JULIE - Strindberg
    {
        id: 'miss_julie',
        title: 'Miss Julie',
        author: 'August Strindberg',
        theme: 'Class and Sexuality',
        color: '#f43f5e',
        frames: [
            { name: 'Midsummer Eve', description: 'Servants dance.', trauma: 0.2, entropy: 0.5, focusLayer: 0, script: { speaker: 'Kristin', text: "Miss Julie is crazy again tonight.", chord: 'Folk Dance', analysis: 'The suspension of class boundaries.' } },
            { name: 'Julie Descends', description: 'The lady comes to servants.', trauma: 0.4, entropy: 0.6, focusLayer: 4, script: { speaker: 'Julie', text: "Come dance with me, Jean.", chord: 'Transgression', analysis: 'Crossing the class line.' } },
            { name: "Jean's Dreams", description: "The valet's ambition.", trauma: 0.3, entropy: 0.5, focusLayer: 3, script: { speaker: 'Jean', text: "I have been brought up to control myself.", chord: 'Restraint', analysis: 'The disciplined servant.' } },
            { name: 'Seduction', description: 'The encounter happens.', trauma: 0.6, entropy: 0.8, focusLayer: 1, script: { speaker: 'Julie', text: "You are so nice to talk to.", chord: 'Desire', analysis: 'The moment of fall.' } },
            { name: 'After', description: 'Shame and blame.', trauma: 0.8, entropy: 0.6, focusLayer: 2, script: { speaker: 'Jean', text: "You are a fallen woman now.", chord: 'Accusation', analysis: 'The double standard.' } },
            { name: 'Escape Plan', description: 'Fantasy of running away.', trauma: 0.5, entropy: 0.7, focusLayer: 5, script: { speaker: 'Julie', text: "We will go to Italy. We will open a hotel.", chord: 'Fantasy', analysis: 'The impossible plan.' } },
            { name: 'Bird Killed', description: 'Jean kills the pet.', trauma: 0.9, entropy: 0.5, focusLayer: 1, script: { speaker: 'Jean', text: "Give me the bird. I'll kill it.", chord: 'Violence', analysis: 'Symbolic murder.' } },
            { name: 'Father Returns', description: 'The bell rings.', trauma: 0.7, entropy: 0.4, focusLayer: 5, script: { speaker: 'Jean', text: "It is the Count. His bell.", chord: 'Authority', analysis: 'The Name-of-the-Father sounds.' } },
            { name: 'The Razor', description: 'Jean gives Julie the blade.', trauma: 0.95, entropy: 0.3, focusLayer: 6, script: { speaker: 'Jean', text: "Here is the razor. Go now while it's light.", chord: 'Death Command', analysis: "The servant commands the master's daughter to die." } },
            { name: 'Julie Exits', description: 'The final walk.', trauma: 1.0, entropy: 0.2, focusLayer: -1, script: { speaker: 'Julie', text: "Thank you. Now I am going.", chord: 'Final Steps', analysis: 'Class victory through death.' } }
        ]
    },

    // THE IMPORTANCE OF BEING EARNEST - Wilde
    {
        id: 'earnest',
        title: 'The Importance of Being Earnest',
        author: 'Oscar Wilde',
        theme: 'Identity and Artifice',
        color: '#fbbf24',
        frames: [
            { name: 'Bunburying', description: 'Algernon explains his method.', trauma: 0.1, entropy: 0.6, focusLayer: 5, script: { speaker: 'Algernon', text: "I have invented an invaluable permanent invalid called Bunbury.", chord: 'Comedy Theme', analysis: 'The art of the excuse.' } },
            { name: 'Ernest in Town', description: "Jack's double life.", trauma: 0.2, entropy: 0.5, focusLayer: 4, script: { speaker: 'Jack', text: "When one is in town one amuses oneself. When in the country one amuses other people.", chord: 'Town/Country', analysis: 'The split self.' } },
            { name: "Gwendolen's Ernest", description: 'She loves the name.', trauma: 0.2, entropy: 0.4, focusLayer: 3, script: { speaker: 'Gwendolen', text: "My ideal has always been to love someone named Ernest.", chord: 'Romantic', analysis: 'The signifier trumps the signified.' } },
            { name: 'Lady Bracknell Interview', description: 'The handbag.', trauma: 0.4, entropy: 0.7, focusLayer: 5, script: { speaker: 'Lady Bracknell', text: "A handbag?", chord: 'Shock', analysis: 'The horror of the foundling.' } },
            { name: "Cecily's Diary", description: 'Pre-written romance.', trauma: 0.2, entropy: 0.6, focusLayer: 4, script: { speaker: 'Cecily', text: "We have been engaged for three months. It is all here in my diary.", chord: 'Fantasy', analysis: 'Reality created by documentation.' } },
            { name: 'Two Ernests', description: 'Both girls deceived.', trauma: 0.5, entropy: 0.8, focusLayer: 2, script: { speaker: 'Gwendolen', text: "Both of you named Ernest? Is that possible?", chord: 'Confusion', analysis: 'The lie multiplies.' } },
            { name: 'Muffins', description: 'The argument.', trauma: 0.3, entropy: 0.7, focusLayer: 0, script: { speaker: 'Algernon', text: "I don't care for anyone in the whole world but you, and you treat me like this!", chord: 'Farce', analysis: 'Trivial quarrel.' } },
            { name: 'Miss Prism Identified', description: 'The governess speaks.', trauma: 0.4, entropy: 0.5, focusLayer: 6, script: { speaker: 'Lady Bracknell', text: "Prism! Where is that baby?", chord: 'Recognition', analysis: 'The mystery unravels.' } },
            { name: 'Jack is Ernest', description: 'True identity revealed.', trauma: 0.3, entropy: 0.4, focusLayer: 5, script: { speaker: 'Jack', text: "I always told you, Gwendolen, my name was Ernest. I finally realize I was speaking the truth.", chord: 'Resolution', analysis: 'The lie becomes truth.' } },
            { name: 'Vital Importance', description: 'Final line.', trauma: 0.1, entropy: 0.3, focusLayer: 0, script: { speaker: 'Jack', text: "I've now realized for the first time in my life the vital Importance of Being Earnest.", chord: 'Comedy Finale', analysis: 'The pun as conclusion.' } }
        ]
    }
];
