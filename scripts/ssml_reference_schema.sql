-- SSML Reference Documentation Schema
-- Created: 2026-01-05
-- Purpose: Searchable SSML markup with vector embedding support

-- Enable vector extension if available
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. SSML Elements Reference Table
CREATE TABLE IF NOT EXISTS ssml_elements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    element_name VARCHAR(50) NOT NULL,
    namespace VARCHAR(100) DEFAULT 'http://www.w3.org/2001/10/synthesis',
    syntax TEXT NOT NULL,
    description TEXT NOT NULL,
    example TEXT,
    provider_support JSONB DEFAULT '{}'::jsonb,
    -- Vector embedding for semantic search (384-dim for sentence-transformers)
    embedding vector(384),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Prosody Parameters Reference
CREATE TABLE IF NOT EXISTS ssml_prosody_params (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    param_name VARCHAR(50) NOT NULL,
    value_range VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    emotion_mapping JSONB DEFAULT '{}'::jsonb,
    example TEXT,
    embedding vector(384),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Emotion Style References (for Azure mstts:express-as)
CREATE TABLE IF NOT EXISTS ssml_emotion_styles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    style_name VARCHAR(50) NOT NULL,
    provider VARCHAR(30) DEFAULT 'azure',
    description TEXT NOT NULL,
    psychometric_mapping JSONB DEFAULT '{}'::jsonb,
    voice_compatibility TEXT[],
    example_ssml TEXT,
    embedding vector(384),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create GIN index for JSONB searches
CREATE INDEX IF NOT EXISTS idx_ssml_elements_provider ON ssml_elements USING GIN (provider_support);
CREATE INDEX IF NOT EXISTS idx_ssml_emotions_mapping ON ssml_emotion_styles USING GIN (psychometric_mapping);

-- Insert core SSML elements
INSERT INTO ssml_elements (element_name, syntax, description, example, provider_support) VALUES
('speak', '<speak version="1.0" xmlns="...">...</speak>', 'Root element of all SSML documents', '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">Hello world</speak>', '{"azure": true, "google": true, "aws": true, "elevenlabs": false}'::jsonb),
('voice', '<voice name="...">...</voice>', 'Specifies the voice to use for synthesis', '<voice name="en-US-JennyNeural">Hello</voice>', '{"azure": true, "google": true, "aws": true}'::jsonb),
('prosody', '<prosody rate="..." pitch="..." volume="...">...</prosody>', 'Controls rate, pitch, and volume of speech', '<prosody rate="slow" pitch="+10%">Dramatic pause</prosody>', '{"azure": true, "google": true, "aws": true}'::jsonb),
('break', '<break time="..."/>', 'Inserts a pause in speech', '<break time="500ms"/>', '{"azure": true, "google": true, "aws": true}'::jsonb),
('emphasis', '<emphasis level="...">...</emphasis>', 'Adds stress to text', '<emphasis level="strong">Important!</emphasis>', '{"azure": true, "google": true, "aws": true}'::jsonb),
('say-as', '<say-as interpret-as="...">...</say-as>', 'Specifies how to interpret text (date, time, etc)', '<say-as interpret-as="date" format="mdy">12-31-2026</say-as>', '{"azure": true, "google": true, "aws": true}'::jsonb),
('sub', '<sub alias="...">...</sub>', 'Substitutes pronunciation', '<sub alias="World Wide Web Consortium">W3C</sub>', '{"azure": true, "google": true, "aws": true}'::jsonb),
('phoneme', '<phoneme alphabet="ipa" ph="...">...</phoneme>', 'Specifies exact phonetic pronunciation', '<phoneme alphabet="ipa" ph="tə.ˈmeɪ.toʊ">tomato</phoneme>', '{"azure": true, "google": true}'::jsonb),
('mstts:express-as', '<mstts:express-as style="..." styledegree="...">...</mstts:express-as>', 'Azure-specific emotion/style control', '<mstts:express-as style="fearful" styledegree="1.5">I hear something</mstts:express-as>', '{"azure": true, "google": false, "aws": false}'::jsonb),
('mstts:silence', '<mstts:silence type="..." value="..."/>', 'Azure-specific silence control', '<mstts:silence type="Sentenceboundary" value="200ms"/>', '{"azure": true}'::jsonb);

-- Insert prosody parameters
INSERT INTO ssml_prosody_params (param_name, value_range, description, emotion_mapping, example) VALUES
('rate', 'x-slow | slow | medium | fast | x-fast | 0.5-3.0', 'Speed of speech delivery', '{"fearful": 1.2, "sad": 0.85, "excited": 1.15, "angry": 1.1}'::jsonb, '<prosody rate="1.2">Hurried speech</prosody>'),
('pitch', 'x-low | low | medium | high | x-high | -50% to +50%', 'Fundamental frequency of voice', '{"fearful": "+15%", "sad": "-8%", "excited": "+8%", "angry": "+5%"}'::jsonb, '<prosody pitch="+10%">High pitch</prosody>'),
('volume', 'silent | x-soft | soft | medium | loud | x-loud | 0dB to +50dB', 'Loudness of speech', '{"whispering": "x-soft", "shouting": "x-loud", "default": "medium"}'::jsonb, '<prosody volume="loud">Shouting!</prosody>'),
('contour', '(x%, y Hz) pairs', 'Pitch contour over time', '{"hopeful": "(0%,+0Hz) (50%,+20Hz) (100%,+10Hz)"}'::jsonb, '<prosody contour="(0%,+0Hz) (25%,+20Hz)">Rising tone</prosody>'),
('range', 'x-low | low | medium | high | x-high', 'Pitch variation range', '{"excited": "high", "sad": "low", "default": "medium"}'::jsonb, '<prosody range="high">Expressive speech</prosody>');

-- Insert emotion styles for Azure
INSERT INTO ssml_emotion_styles (style_name, provider, description, psychometric_mapping, voice_compatibility, example_ssml) VALUES
('cheerful', 'azure', 'Bright, upbeat, positive tone', '{"trauma_max": 0.3, "entropy_min": 0.4}'::jsonb, ARRAY['en-US-JennyNeural', 'en-US-GuyNeural'], '<mstts:express-as style="cheerful" styledegree="1.2">Great news!</mstts:express-as>'),
('angry', 'azure', 'Tense, forceful, frustrated delivery', '{"trauma_min": 0.6, "entropy_range": [0.4, 0.7]}'::jsonb, ARRAY['en-US-JennyNeural', 'en-US-GuyNeural'], '<mstts:express-as style="angry">This is unacceptable!</mstts:express-as>'),
('sad', 'azure', 'Slow, melancholic, sorrowful tone', '{"trauma_min": 0.7, "entropy_max": 0.4}'::jsonb, ARRAY['en-US-JennyNeural', 'en-US-AriaNeural'], '<mstts:express-as style="sad">I''m so sorry.</mstts:express-as>'),
('fearful', 'azure', 'Nervous, trembling, anxious voice', '{"trauma_min": 0.8, "entropy_min": 0.6}'::jsonb, ARRAY['en-US-JennyNeural', 'en-US-AriaNeural'], '<mstts:express-as style="fearful" styledegree="1.5">What was that sound?</mstts:express-as>'),
('excited', 'azure', 'Energetic, enthusiastic, animated', '{"trauma_max": 0.4, "entropy_min": 0.7}'::jsonb, ARRAY['en-US-JennyNeural', 'en-US-GuyNeural'], '<mstts:express-as style="excited">We won!</mstts:express-as>'),
('friendly', 'azure', 'Warm, approachable, conversational', '{"trauma_max": 0.4, "entropy_max": 0.5}'::jsonb, ARRAY['en-US-JennyNeural', 'en-US-SaraNeural'], '<mstts:express-as style="friendly">Hey there!</mstts:express-as>'),
('hopeful', 'azure', 'Optimistic, rising intonation', '{"rsi.symbolic_dominant": true}'::jsonb, ARRAY['en-US-JennyNeural'], '<mstts:express-as style="hopeful">Things will get better.</mstts:express-as>'),
('whispering', 'azure', 'Quiet, intimate, secretive tone', '{"rsi.imaginary_min": 0.5}'::jsonb, ARRAY['en-US-JennyNeural', 'en-US-AriaNeural'], '<mstts:express-as style="whispering">Don''t tell anyone.</mstts:express-as>'),
('shouting', 'azure', 'Loud, urgent, high volume', '{"trauma_min": 0.5, "entropy_min": 0.8}'::jsonb, ARRAY['en-US-GuyNeural'], '<mstts:express-as style="shouting">Run!</mstts:express-as>');
