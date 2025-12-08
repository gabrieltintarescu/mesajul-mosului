import { ChildDetails } from '@/lib/supabase/database.types';
import OpenAI from 'openai';

let _openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
    if (!_openai) {
        _openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    return _openai;
}

export async function generateSantaScript(childDetails: ChildDetails): Promise<string> {
    const behaviorText =
        childDetails.behavior === 'nice'
            ? 'a fost foarte cuminte anul acesta'
            : childDetails.behavior === 'mostly_nice'
                ? 'a fost în general cuminte anul acesta, cu doar câteva momente de năzbâtii'
                : 'a avut câteva momente mai puțin bune, dar Moș Crăciun crede în a doua șansă';

    const genderArticle = childDetails.gender === 'boy' ? 'el' : 'ea';

    const prompt = `Ești Moș Crăciun și creezi un mesaj video personalizat pentru un copil. Scrie un script cald, magic și încurajator pe care Moșul îl va spune direct copilului. SCRIE ÎNTREGUL TEXT ÎN LIMBA ROMÂNĂ.

Detalii despre copil:
- Nume: ${childDetails.name}
- Vârstă: ${childDetails.age} ani
- Gen: ${childDetails.gender === 'boy' ? 'băiat' : 'fată'}
- Realizările din acest an: ${childDetails.achievements}
- Lucruri preferate: ${childDetails.favoriteThings}
- Comportament: ${genderArticle} ${behaviorText}

Instrucțiuni:
1. Începe cu un salut cald "Ho ho ho!" și adresează-te copilului pe nume
2. Menționează că l-ai urmărit de la Polul Nord și ești mândru de realizările sale
3. Referă-te la lucrurile preferate pentru a face mesajul personal
4. Recunoaște comportamentul într-un mod pozitiv și încurajator
5. Creează entuziasm pentru Crăciun
6. Încheie cu urări calde și amintește-i să fie în continuare cuminte
7. Păstrează lungimea între 45-60 secunde când este vorbit (aproximativ 120-150 cuvinte)
8. Folosește un ton cald și vesel, specific lui Moș Crăciun
9. NU include indicații de regie sau note - doar cuvintele vorbite
10. Folosește numele copilului de 2-3 ori pe parcursul mesajului

Scrie DOAR scriptul pe care Moș Crăciun îl va spune, nimic altceva:`;

    const completion = await getOpenAI().chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                role: 'system',
                content:
                    'Ești Moș Crăciun. Scrii scripturi calde și magice pentru mesaje video personalizate către copii. Tonul tău este vesel, blând și încurajator. Răspunde ÎNTOTDEAUNA în limba română.',
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
        max_tokens: 400,
        temperature: 0.8,
    });

    const script = completion.choices[0]?.message?.content?.trim();

    if (!script) {
        throw new Error('Failed to generate script from OpenAI');
    }

    return script;
}
