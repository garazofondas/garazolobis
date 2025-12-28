# 🔧 Garažo Lobis - Saugumo Gidas

Sveikas! Tavo platforma jau pasiekė "Live" stadiją. Štai kaip viską sujungti saugiai.

## 🛡️ Svarbiausia: Stripe Raktai
Turi du raktus:
1. **Publishable Key (PK):** Jis yra viešas, naudojamas pirkimo lange. Jis jau įrašytas kode.
2. **Secret Key (SK):** Tai tavo "banko raktas". Jo negali būti kode.

### Kaip pridėti Secret Key į Vercel:
1. Eik į savo [Vercel Dashboard](https://vercel.com/dashboard).
2. Atsidaryk `garazolobis` projektą.
3. Spausk **Settings** -> **Environment Variables**.
4. Pridėk naują:
   - **Key:** `STRIPE_SECRET_KEY`
   - **Value:** `sk_live_...` (tavo slaptas raktas iš Stripe)
5. Spausk **Save**.

## 🚀 Kaip paleisti atnaujinimus?
Jei pakeitei kodą savo kompiuteryje:
1. `git add .`
2. `git commit -m "Atnaujinimas"`
3. `git push origin main`
Vercel automatiškai pastebės pakeitimus ir per minutę atnaujins tavo svetainę.

## 💡 AI Integracija
Nepamiršk Vercel aplinkoje pridėti ir `API_KEY` (Gemini API), kad veiktų nuotraukų atpažinimas!
