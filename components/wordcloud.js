class WordCloud {
    constructor(selector, data) {
        this.selector = selector;
        this.data = data;
        this.maximalComments = 50;
        this.stopWords = [
            "able", "about", "above", "abroad", "according", "accordingly", "across",
            "actually", "adj", "after", "afterwards", "again", "against", "ago", "ahead",
            "ain't", "all", "allow", "allows", "almost", "alone", "along", "alongside",
            "already", "also", "although", "always", "am", "amid", "amidst", "among",
            "amongst", "an", "and", "another", "any", "anybody", "anyhow", "anyone",
            "anything", "anyway", "anyways", "anywhere", "apart", "appear", "appreciate",
            "appropriate", "are", "aren't", "around", "as", "a's", "aside", "ask",
            "asking", "associated", "at", "available", "away", "awfully", "back",
            "backward", "backwards", "be", "became", "because", "become", "becomes",
            "becoming", "been", "before", "beforehand", "begin", "behind", "being",
            "believe", "below", "beside", "besides", "best", "better", "between",
            "beyond", "both", "brief", "but", "by", "came", "can", "cannot", "cant",
            "can't", "caption", "cause", "causes", "certain", "certainly", "changes",
            "clearly", "c'mon", "co", "co.", "com", "come", "comes", "concerning",
            "consequently", "consider", "considering", "contain", "containing",
            "contains", "corresponding", "could", "couldn't", "course", "c's", "currently",
            "dare", "daren't", "definitely", "described", "despite", "did", "didn't",
            "different", "directly", "do", "does", "doesn't", "doing", "done", "don't",
            "down", "downwards", "during", "each", "edu", "eg", "eight", "eighty",
            "either", "else", "elsewhere", "end", "ending", "enough", "entirely",
            "especially", "et", "etc", "even", "ever", "evermore", "every", "everybody",
            "everyone", "everything", "everywhere", "ex", "exactly", "example", "except",
            "fairly", "far", "farther", "few", "fewer", "fifth", "first", "five",
            "followed", "following", "follows", "for", "forever", "former", "formerly",
            "forth", "forward", "found", "four", "from", "further", "furthermore",
            "get", "gets", "getting", "given", "gives", "go", "goes", "going", "gone",
            "got", "gotten", "greetings", "had", "hadn't", "half", "happens", "hardly",
            "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "hello",
            "help", "hence", "her", "here", "hereafter", "hereby", "herein", "here's",
            "hereupon", "hers", "herself", "he's", "hi", "him", "himself", "his", "hither",
            "hopefully", "how", "howbeit", "however", "hundred", "i'd", "ie", "if",
            "ignored", "i'll", "i'm", "immediate", "in", "inasmuch", "inc", "inc.",
            "indeed", "indicate", "indicated", "indicates", "inner", "inside", "insofar",
            "instead", "into", "inward", "is", "isn't", "it", "it'd", "it'll", "its",
            "it's", "itself", "i've", "just", "k", "keep", "keeps", "kept", "know",
            "known", "knows", "last", "lately", "later", "latter", "latterly", "least",
            "less", "lest", "let", "let's", "like", "liked", "likely", "likewise", "little",
            "look", "looking", "looks", "low", "lower", "ltd", "made", "mainly", "make",
            "makes", "many", "may", "maybe", "mayn't", "me", "mean", "meantime",
            "meanwhile", "merely", "might", "mightn't", "mine", "minus", "miss", "more",
            "moreover", "most", "mostly", "mr", "mrs", "much", "must", "mustn't", "my",
            "myself", "name", "namely", "nd", "near", "nearly", "necessary", "need",
            "needn't", "needs", "neither", "never", "neverf", "neverless", "nevertheless",
            "new", "next", "nine", "ninety", "no", "nobody", "non", "none", "nonetheless",
            "noone", "no-one", "nor", "normally", "not", "nothing", "notwithstanding",
            "novel", "now", "nowhere", "obviously", "of", "off", "often", "oh", "ok",
            "okay", "old", "on", "once", "one", "ones", "one's", "only", "onto", "opposite",
            "or", "other", "others", "otherwise", "ought", "oughtn't", "our", "ours",
            "ourselves", "out", "outside", "over", "overall", "own", "particular",
            "particularly", "past", "per", "perhaps", "placed", "please", "plus", "possible",
            "presumably", "probably", "provided", "provides", "que", "quite", "qv", "rather",
            "rd", "re", "really", "reasonably", "recent", "recently", "regarding", "regardless",
            "regards", "relatively", "respectively", "right", "round", "said", "same", "saw",
            "say", "saying", "says", "second", "secondly", "see", "seeing", "seem", "seemed",
            "seeming", "seems", "seen", "self", "selves", "sensible", "sent", "serious",
            "seriously", "seven", "several", "shall", "shan't", "she", "she'd", "she'll",
            "she's", "should", "shouldn't", "since", "six", "so", "some", "somebody", "someday",
            "somehow", "someone", "something", "sometime", "sometimes", "somewhat", "somewhere",
            "soon", "sorry", "specified", "specify", "specifying", "still", "sub", "such", "sup",
            "sure", "take", "taken", "taking", "tell", "tends", "th", "than", "thank", "thanks",
            "thanx", "that", "that'll", "thats", "that's", "that've", "the", "their", "theirs",
            "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "there'd",
            "therefore", "therein", "there'll", "there're", "theres", "there's", "thereupon",
            "there've", "these", "they", "they'd", "they'll", "they're", "they've", "thing",
            "things", "think", "third", "thirty", "this", "thorough", "thoroughly", "those",
            "though", "three", "through", "throughout", "thru", "thus", "till", "to", "together",
            "too", "took", "toward", "towards", "tried", "tries", "truly", "try", "trying", "t's",
            "twice", "two", "un", "under", "underneath", "undoing", "unfortunately", "unless",
            "unlike", "unlikely", "until", "unto", "up", "upon", "upwards", "us", "use", "used",
            "useful", "uses", "using", "usually", "v", "value", "various", "versus", "very", "via",
            "viz", "vs", "want", "wants", "was", "wasn't", "way", "we", "we'd", "welcome", "well",
            "we'll", "went", "were", "we're", "weren't", "we've", "what", "whatever", "what'll",
            "what's", "what've", "when", "whence", "whenever", "where", "whereafter", "whereas",
            "whereby", "wherein", "where's", "whereupon", "wherever", "whether", "which",
            "whichever", "while", "whilst", "whither", "who", "who'd", "whoever", "whole",
            "who'll", "whom", "whomever", "who's", "whose", "why", "will", "willing", "wish",
            "with", "within", "without", "wonder", "won't", "would", "wouldn't", "yes", "yet",
            "you", "you'd", "you'll", "your", "you're", "yours", "yourself", "yourselves",
            "you've", "zero", "a", "how's", "i", "when's", "why's", "b", "c", "d", "e", "f", "g",
            "h", "j", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "uucp", "w", "x", "y", "z",
            "I", "www", "amount", "bill", "bottom", "call", "computer", "con", "couldnt", "cry",
            "de", "describe", "detail", "due", "eleven", "empty", "fifteen", "fifty", "fill",
            "find", "fire", "forty", "front", "full", "give", "hasnt", "herse", "himse", "interest",
            "itse", "mill", "move", "myse", "part", "put", "show", "side", "sincere", "sixty",
            "system", "ten", "thick", "thin", "top", "twelve", "twenty", "abst", "accordance",
            "act", "added", "adopted", "affected", "affecting", "affects", "ah", "announce",
            "anymore", "apparently", "approximately", "aren", "arent", "arise", "auth", "beginning",
            "beginnings", "begins", "biol", "briefly", "ca", "date", "ed", "effect", "et-al", "ff",
            "fix", "gave", "giving", "heres", "hes", "hid", "home", "id", "im", "immediately",
            "importance", "important", "index", "information", "invention", "itd", "keys", "kg",
            "km", "largely", "lets", "line", "ll", "means", "mg", "million", "ml", "mug", "na",
            "nay", "necessarily", "nos", "noted", "obtain", "obtained", "omitted", "ord", "owing",
            "page", "pages", "poorly", "possibly", "potentially", "pp", "predominantly", "present",
            "previously", "primarily", "promptly", "proud", "quickly", "ran", "readily", "ref",
            "refs", "related", "research", "resulted", "resulting", "results", "run", "sec",
            "section", "shed", "shes", "showed", "shown", "showns", "shows", "significant",
            "significantly", "similar", "similarly", "slightly", "somethan", "specifically",
            "state", "states", "stop", "strongly", "substantially", "successfully", "sufficiently",
            "suggest", "thered", "thereof", "therere", "thereto", "theyd", "theyre", "thou",
            "thoughh", "thousand", "throug", "til", "tip", "ts", "ups", "usefully", "usefulness",
            "ve", "vol", "vols", "wed", "whats", "wheres", "whim", "whod", "whos", "widely", "words",
            "world", "youd", "youre", "hong", "kong", "didnt", "brthe", "wan"
          ];
    }

    initializeData() {
        this.districtData  = d3.rollup(this.data,
            v => v.slice(0, this.maximalComments).map(d => d.comments).join(' ').toUpperCase().replace(/<br\/>|\\r/g, '').replace(/[^\p{Script=Hangul}\p{Script=Han}\p{L}\s]+/gu, ''),
            d => d.district
        );
        this.ratingData = d3.rollup(this.data,
            v => v.slice(0, this.maximalComments).map(d => d.comments).join(' ').toUpperCase().replace(/<br\/>|\\r/g, '').replace(/[^\p{Script=Hangul}\p{Script=Han}\p{L}\s]+/gu, ''),
            d => Math.floor(d.review_scores_rating)
        )
        this.districtRatingData = d3.rollup(this.data,
            v => v.slice(0, this.maximalComments).map(d => d.comments).join(' ').toUpperCase().replace(/<br\/>|\\r/g, '').replace(/[^\p{Script=Hangul}\p{Script=Han}\p{L}\s]+/gu, ''),
            d => d.district,
            d => Math.floor(d.review_scores_rating) 
        );
    }

    initialize() {
        this.svg = d3.select(this.selector);
        this.initializeData();
        this.resize();

        $(window).on("resize", () => this.resize());

        this.update();
    }

    update(clickedDistrict=[], rating=5) {
        let comments;
        if (clickedDistrict.length === 0) {
            comments = this.ratingData.get(rating);
        } else {
            comments = [];
            clickedDistrict.forEach(district => {
                const districtData = this.districtRatingData.get(district);
                if (districtData) {
                    const districtComments = districtData.get(rating);
                    if (districtComments) {
                        comments = comments.concat(districtComments);
                    }
                }
            });
        }
        if (!comments) {
            console.error(`No comments for district ${clickedDistrict} and rating ${rating}`);
            return;
        }

        if (Array.isArray(comments)) {
            comments = comments.map(comment => JSON.stringify(comment)).join(" ");
        }
        const words = Array.from(d3.rollup(comments.split(/\s+/).filter(word => word.length > 2 && !this.stopWords.includes(word.toLowerCase())), v => v.length, d => d), ([text, size]) => ({text, size}));        const layout = d3.layout.cloud()
            .size([this.width, this.height])
            .words(words)
            .rotate(() => ~~(Math.random() * 2) * 90)
            .font("Impact")
            .fontSize(d => Math.sqrt(d.size) * 10)
            .on("end", words => this.draw(words));

        layout.start();
    }

    draw(words) {
        this.svg.selectAll("*").remove(); // Clear previous words
        this.svg.append("g")
            .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`)
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", d => d.size + "px")
            .style("font-family", "Impact")
            .style("fill", (_, i) => d3.schemeCategory10[i % 10])
            .attr("text-anchor", "middle")
            .attr("transform", d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
            .text(d => d.text);
    }

    resize() {
        let updateFlag = false;
        const currentWidth = parseInt(d3.select(".container").style("width")) / 2 - 50;
        if(currentWidth != this.width) updateFlag = true;
        this.width = parseInt(d3.select(".container").style("width")) / 2 - 50;
    
        this.width = Math.max(this.width, 420);
        this.height = this.width;
        this.svg.style("width", this.width + "px").style("height", this.height + "px");

        if(updateFlag && this.width > 420) this.update();
    }
}
