# GitHub Pages and IONOS setup

Prepared 22 October 2026 for the domains shown in your IONOS screenshot.

## The intended result

| Address | Destination |
| --- | --- |
| `sarthakchadha.com` | Main portfolio on GitHub Pages |
| `www.sarthakchadha.com` | Redirect to `https://sarthakchadha.com/` |
| `sarthakchadha.de` and `www.sarthakchadha.de` | Forward to `https://sarthakchadha.com/` |
| `sarthakchadha.global` and `www.sarthakchadha.global` | Forward to `https://sarthakchadha.com/` |
| `sarthakchadha.store` and `www.sarthakchadha.store` | Forward to `https://sarthakchadha.com/` |

These are the target settings. They have not yet been applied to your GitHub or IONOS accounts. Essentia Resonance has its own website and repository.

## 1. Upload the portfolio to GitHub

Create a new public repository named `sarthak-portfolio` in the account that owns your existing projects. These instructions use the GitHub username `petrichor-sc`; substitute the actual account if you publish elsewhere.

Extract the ZIP and upload the contents of the `sarthak-portfolio` folder. The GitHub repository root should contain `docs`, `apps`, `src`, `public`, `scripts`, `package.json` and these instructions. Avoid an extra enclosing folder above `docs`.

Open **Settings → Pages**. Under **Build and deployment**, select:

- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/docs**

Save and wait for the Pages deployment to finish. Use **Visit site** to test the project cards and the Communication Systems app.

This is a prebuilt static site: no local Node installation is required for this upload route.

## 2. Set the main domain in GitHub

In the same repository, open **Settings → Pages → Custom domain**.

Enter exactly:

```text
sarthakchadha.com
```

Click **Save**. Configure this setting before pointing the domain to GitHub. For branch-based publication, GitHub writes the publishing source's CNAME file. If the file needs to be added manually, copy the contents of `deployment/CNAME` to `docs/CNAME`.

After the custom domain is selected, the original GitHub Pages address can redirect to it. The custom address will work once its DNS is configured.

The GitHub **account Settings → Pages** area also provides domain verification. If you use it, copy the TXT record GitHub supplies exactly; its verification value is account-specific and is not included here.

## 3. Point only the main .com domain to GitHub

In IONOS, open **Domains & SSL** and the DNS settings for **sarthakchadha.com**. On your screenshot this domain is marked **Domain nicht verwendet**.

The intended IPv4 configuration is:

| Type | Host name | Points to / value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `petrichor-sc.github.io` |

The `www` target is the GitHub account's Pages host, with no `https://`, repository name or path. In IONOS, `@` means the bare domain.

If IPv6 records are present for this website, they should use GitHub's values:

| Type | Host name | Points to / value |
| --- | --- | --- |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |

Replace conflicting website-address records for `@` or `www` when applying this setup. Keep email-related MX/TXT entries and unrelated subdomains.

The `.de`, `.global` and `.store` domains use forwarding in step 5; they do not use this main-domain record table.

## 4. Enable HTTPS for the main site

Return to **GitHub repository → Settings → Pages**. When its DNS check and certificate provisioning succeed, select **Enforce HTTPS**.

GitHub obtains and serves the site's TLS certificate automatically. You do not need to buy an IONOS certificate for the GitHub-hosted `.com` website. GitHub notes that the HTTPS option can take up to 24 hours to become available.

With the `.com` apex and `www` DNS records configured, GitHub Pages redirects the `www` variant to the selected bare-domain address.

Test all four:

- `http://sarthakchadha.com`
- `https://sarthakchadha.com`
- `http://www.sarthakchadha.com`
- `https://www.sarthakchadha.com`

Each should end at `https://sarthakchadha.com/` without a certificate error.

## 5. Forward .de, .global and .store through IONOS

For each additional personal domain in **Domains & SSL**:

1. Open the domain. From the screenshot's **Domain verwenden** entry, look for its destination or forwarding settings. IONOS documents the route as **Details → Adjust Destination → Domain Forwarding**; German labels may differ.
2. Choose a forwarding destination of **Arbitrary URL** / an external URL.
3. Enter `https://sarthakchadha.com/`.
4. Choose **HTTP Redirect** / **HTTP-Weiterleitung**. This changes the browser's address to the main website.
5. Enable **Domain forwarding for the www. subdomain**.
6. Save.

Repeat for:

- `sarthakchadha.de`
- `sarthakchadha.global`
- `sarthakchadha.store`

IONOS also documents selecting several domains and applying a forwarding action together. Apply it only to those three secondary personal domains.

The HTTP Redirect option is suitable even though the destination is HTTPS. Frame forwarding embeds the destination while retaining the old address; use the standard HTTP redirect for this setup. If the interface offers a permanent-versus-temporary choice, choose permanent / 301.

IONOS handles the forwarding endpoint and its DNS. Its documentation supports HTTP-to-HTTPS and HTTPS-to-HTTPS forwarding. Check the HTTPS source variants after saving as well; the main site's GitHub certificate does not establish that each secondary source domain is working.

## 6. Check the finished result

Test both HTTP and HTTPS, with and without `www`, for `.com`, `.de`, `.global` and `.store`. Each of the 16 address variants should arrive at the same HTTPS `.com` homepage.

Then test:

- `/projects/`
- `/projects/communication-systems/`
- `/projects/sensa/`
- `/projects/synesthesia/`

The project links should stay on the primary `.com` address. IONOS forwarding should be checked separately if you also need old links on secondary domains to retain their path or query; this guide does not assume path preservation.

## Official references

- [GitHub: managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [GitHub: HTTPS for GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
- [IONOS: changing A and AAAA records](https://www.ionos.com/help/domains/configuring-your-ip-address/changing-a-domains-ipv4/ipv6-address-a/aaaa-record/)
- [IONOS: configuring a CNAME record](https://www.ionos.com/help/domains/configuring-cname-records-for-subdomains/configuring-a-cname-record-for-a-subdomain/)
- [IONOS: forwarding a domain to another domain](https://www.ionos.com/help/domains/forwarding-a-domain/forwarding-a-domain-to-a-different-domain/)
- [IONOS: actions for multiple domains](https://www.ionos.com/help/domains/domain-actions-for-multiple-domains/performing-domain-actions-for-multiple-domains/)

