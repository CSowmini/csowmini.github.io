# Adding Your Portfolio Components

Follow these steps in VS Code to add all your components:

## Step 1: Create the components folder

In VS Code, in your `data-portfolio` folder:
1. Right-click on the `app` folder
2. Select "New Folder"
3. Name it `components`

## Step 2: Add each component file

For each file below, create it in the `app/components/` folder:

### File 1: Hero.tsx
Copy the content from the `Hero.tsx` file I provided

### File 2: About.tsx
Copy the content from the `About.tsx` file I provided

### File 3: Experience.tsx
Copy the content from the `Experience.tsx` file I provided

### File 4: Projects.tsx
Copy the content from the `Projects.tsx` file I provided

### File 5: Contact.tsx
Copy the content from the `Contact.tsx` file I provided

### File 6: ChatBot.tsx
Copy the content from the `ChatBot.tsx` file I provided

## Step 3: Update app/page.tsx

Replace the ENTIRE content of `app/page.tsx` with the content from `app-page.tsx` I provided

## Step 4: Check your work

Your folder structure should now look like:
```
data-portfolio/
├── app/
│   ├── components/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Experience.tsx
│   │   ├── Projects.tsx
│   │   ├── Contact.tsx
│   │   └── ChatBot.tsx
│   ├── page.tsx (updated)
│   ├── layout.tsx
│   └── globals.css
```

## Step 5: View your portfolio

The dev server should still be running. Go to:
http://localhost:3000

You should see your beautiful new portfolio!

## Customization

Update these parts to make it yours:

1. **Contact.tsx** - Update email, LinkedIn, GitHub URLs
2. **ChatBot.tsx** - Customize the responses if you want
3. **About.tsx** - Adjust your bio text
4. **Experience.tsx** - Add more positions or details
5. **Projects.tsx** - Change project icons/names

## Next Steps

Once everything works:
```bash
git add .
git commit -m "Complete portfolio implementation"
git push origin main
```

Then deploy to Vercel as described in the setup guide!
