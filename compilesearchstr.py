import csv

def main():
	searchstr = ""
	phrases = []
	with open("indifferentlanguages.tsv", newline="") as f:
		reader = csv.reader(f, delimiter="\t")
		next(reader, None)
		for row in reader:
			if len(row) > 1:
				rowphrases = ['"' + x + '"' for p in row[1:] for x in p.split(",")]
				phrases += rowphrases
				# print(rowphrases)
		# print(phrases)
		searchstr = " OR ".join(phrases)
		print(searchstr)

if __name__ == "__main__":
	main()